import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';

import { BOARD_REALTIME_PORT } from '@core/application/ports/board/board-realtime.port';
import { BoardSnapshot } from '@core/application/ports/board/column-repository.port';
import { CreateColumnUseCase } from '@core/application/use-cases/board/create-column.use-case';
import { CreateTaskUseCase } from '@core/application/use-cases/board/create-task.use-case';
import { DeleteColumnUseCase } from '@core/application/use-cases/board/delete-column.use-case';
import { LoadBoardUseCase } from '@core/application/use-cases/board/load-board.use-case';
import { RenameColumnUseCase } from '@core/application/use-cases/board/rename-column.use-case';
import { ReorderColumnUseCase } from '@core/application/use-cases/board/reorder-column.use-case';
import { ReorderTaskUseCase } from '@core/application/use-cases/board/reorder-task.use-case';
import { BoardColumn } from '@core/domain/models/board/board-column.model';
import { ColumnDraft } from '@core/domain/models/board/column-draft.model';
import { KanbanTask } from '@core/domain/models/board/kanban-task.model';
import { TaskDraft } from '@core/domain/models/board/task-draft.model';
import { TaskMove } from '@core/domain/models/board/task-move.model';
import { TaskOrderingService } from '@core/domain/services/task-ordering.service';

@Injectable()
export class BoardStore {
  private readonly loadBoard = inject(LoadBoardUseCase);
  private readonly createColumnUseCase = inject(CreateColumnUseCase);
  private readonly renameColumnUseCase = inject(RenameColumnUseCase);
  private readonly deleteColumnUseCase = inject(DeleteColumnUseCase);
  private readonly reorderColumnUseCase = inject(ReorderColumnUseCase);
  private readonly createTaskUseCase = inject(CreateTaskUseCase);
  private readonly reorderTask = inject(ReorderTaskUseCase);
  private readonly realtime = inject(BOARD_REALTIME_PORT);
  private readonly destroyRef = inject(DestroyRef);

  private readonly columnsState = signal<readonly BoardColumn[]>([]);
  private readonly tasksState = signal<readonly KanbanTask[]>([]);
  private readonly searchState = signal('');
  private readonly loadingState = signal(false);
  private readonly reorderFailedState = signal(false);
  private readonly creatingColumnState = signal(false);
  private readonly columnReorderFailedState = signal(false);

  private currentProjectId = '';

  readonly columns = this.columnsState.asReadonly();
  readonly tasks = this.tasksState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly reorderFailed = this.reorderFailedState.asReadonly();
  readonly creatingColumn = this.creatingColumnState.asReadonly();
  readonly columnReorderFailed = this.columnReorderFailedState.asReadonly();

  readonly tasksByColumn = computed(() => {
    const term = this.searchState().trim().toLowerCase();
    const grouped = new Map<string, KanbanTask[]>();

    for (const column of this.columnsState()) {
      grouped.set(column.id, []);
    }

    for (const task of this.tasksState()) {
      if (term && !task.title.toLowerCase().includes(term)) {
        continue;
      }

      grouped.get(task.columnId)?.push(task);
    }

    for (const tasks of grouped.values()) {
      tasks.sort((left, right) => left.position - right.position);
    }

    return grouped;
  });

  connect(projectId: string): void {
    this.currentProjectId = projectId;
    this.loadingState.set(true);

    this.loadBoard
      .execute(projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (snapshot: BoardSnapshot) => {
          this.columnsState.set(snapshot.columns);
          this.tasksState.set(snapshot.tasks);
          this.loadingState.set(false);
        },
        error: () => this.loadingState.set(false)
      });

    void this.realtime.join(projectId);

    this.realtime
      .events()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        switch (event.type) {
          case 'task-created':
          case 'task-updated':
          case 'task-moved':
            this.upsertTask(event.task);
            break;
          case 'task-deleted':
            this.removeTask(event.taskId);
            break;
        }
      });

    this.destroyRef.onDestroy(() => {
      if (this.currentProjectId) {
        void this.realtime.leave(this.currentProjectId);
      }
    });
  }

  search(term: string): void {
    this.searchState.set(term);
  }

  createColumn(draft: ColumnDraft): void {
    this.creatingColumnState.set(true);

    this.createColumnUseCase
      .execute(this.currentProjectId, draft)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (column) => {
          this.columnsState.update((columns) => [...columns, column]);
          this.creatingColumnState.set(false);
        },
        error: () => this.creatingColumnState.set(false)
      });
  }

  renameColumn(columnId: string, name: string): Observable<BoardColumn> {
    return this.renameColumnUseCase.execute(columnId, name).pipe(
      tap((column) => {
        this.columnsState.update((columns) =>
          columns.map((item) => (item.id === column.id ? column : item))
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  deleteColumn(columnId: string): Observable<void> {
    return this.deleteColumnUseCase.execute(columnId).pipe(
      tap(() => {
        this.columnsState.update((columns) => columns.filter((item) => item.id !== columnId));
        this.tasksState.update((tasks) => tasks.filter((task) => task.columnId !== columnId));
      }),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  reorderColumn(columnId: string, targetIndex: number): void {
    const snapshot = this.columnsState();
    const currentIndex = snapshot.findIndex((column) => column.id === columnId);

    if (currentIndex === -1) {
      return;
    }

    const reordered = [...snapshot];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    this.columnsState.set(reordered);
    this.columnReorderFailedState.set(false);

    this.reorderColumnUseCase
      .execute(columnId, targetIndex)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.columnsState.set(snapshot);
          this.columnReorderFailedState.set(true);
        }
      });
  }

  dismissColumnReorderError(): void {
    this.columnReorderFailedState.set(false);
  }

  createTask(columnId: string, draft: TaskDraft): void {
    this.createTaskUseCase
      .execute(columnId, draft)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((task) => this.upsertTask(task));
  }

  moveTask(move: TaskMove): void {
    const snapshot = this.tasksState();

    this.tasksState.set(TaskOrderingService.move(snapshot, move));
    this.reorderFailedState.set(false);

    this.reorderTask
      .execute(move)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.tasksState.set(snapshot);
          this.reorderFailedState.set(true);
        }
      });
  }

  dismissReorderError(): void {
    this.reorderFailedState.set(false);
  }

  private upsertTask(task: KanbanTask): void {
    this.tasksState.update((tasks) => {
      const exists = tasks.some((item) => item.id === task.id);

      return exists ? tasks.map((item) => (item.id === task.id ? task : item)) : [...tasks, task];
    });
  }

  private removeTask(taskId: string): void {
    this.tasksState.update((tasks) => tasks.filter((task) => task.id !== taskId));
  }
}
