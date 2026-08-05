import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ReorderTaskUseCase } from '@core/application/use-cases/board/reorder-task.use-case';
import { BoardColumn } from '@core/domain/models/board/board-column.model';
import { KanbanTask } from '@core/domain/models/board/kanban-task.model';
import { TaskMove } from '@core/domain/models/board/task-move.model';
import { TaskOrderingService } from '@core/domain/services/task-ordering.service';

@Injectable()
export class BoardStore {
  private readonly reorderTask = inject(ReorderTaskUseCase);
  private readonly destroyRef = inject(DestroyRef);

  private readonly columnsState = signal<readonly BoardColumn[]>([]);
  private readonly tasksState = signal<readonly KanbanTask[]>([]);
  private readonly searchState = signal('');
  private readonly reorderFailedState = signal(false);

  readonly columns = this.columnsState.asReadonly();
  readonly tasks = this.tasksState.asReadonly();
  readonly reorderFailed = this.reorderFailedState.asReadonly();

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

  load(columns: readonly BoardColumn[], tasks: readonly KanbanTask[]): void {
    this.columnsState.set(columns);
    this.tasksState.set(tasks);
  }

  search(term: string): void {
    this.searchState.set(term);
  }

  addTask(task: KanbanTask): void {
    this.tasksState.update((tasks) => [...tasks, task]);
  }

  nextPosition(columnId: string): number {
    return TaskOrderingService.nextPosition(this.tasksState(), columnId);
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
}
