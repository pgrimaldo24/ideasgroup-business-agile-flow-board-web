import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';

import { BoardSnapshot, ColumnRepositoryPort } from '@core/application/ports/board/column-repository.port';
import { BoardColumn } from '@core/domain/models/board/board-column.model';
import { ColumnDraft } from '@core/domain/models/board/column-draft.model';
import { KanbanTask } from '@core/domain/models/board/kanban-task.model';
import { ApiClient } from '@core/infrastructure/http/api-client.service';

import { BoardColumnDto } from './dto/board-column.dto';
import { CreateBoardColumnRequestDto } from './dto/create-board-column-request.dto';
import { KanbanTaskDto } from './dto/kanban-task.dto';
import { ReorderBoardColumnRequestDto } from './dto/reorder-board-column-request.dto';
import { UpdateBoardColumnRequestDto } from './dto/update-board-column-request.dto';
import { toBoardColumn } from './mappers/board-column.mapper';
import { toKanbanTask } from './mappers/kanban-task.mapper';

@Injectable()
export class ColumnHttpAdapter implements ColumnRepositoryPort {
  private readonly api = inject(ApiClient);

  listByProject(projectId: string): Observable<BoardSnapshot> {
    return this.api.get<BoardColumnDto[]>(`projects/${projectId}/columns`).pipe(
      switchMap((dtos) => {
        const columns = dtos.map(toBoardColumn);

        if (columns.length === 0) {
          return of<BoardSnapshot>({ columns, tasks: [] });
        }

        const tasksByColumn = columns.map((column) => this.listTasksByColumn(column.id));

        return forkJoin(tasksByColumn).pipe(
          map((tasksPerColumn) => ({
            columns,
            tasks: tasksPerColumn.flat()
          }))
        );
      })
    );
  }

  create(projectId: string, draft: ColumnDraft): Observable<BoardColumn> {
    const body: CreateBoardColumnRequestDto = { name: draft.name };

    return this.api
      .post<BoardColumnDto, CreateBoardColumnRequestDto>(`projects/${projectId}/columns`, body)
      .pipe(map(toBoardColumn));
  }

  rename(columnId: string, name: string): Observable<BoardColumn> {
    const body: UpdateBoardColumnRequestDto = { name };

    return this.api
      .put<BoardColumnDto, UpdateBoardColumnRequestDto>(`columns/${columnId}`, body)
      .pipe(map(toBoardColumn));
  }

  delete(columnId: string): Observable<void> {
    return this.api.delete<void>(`columns/${columnId}`);
  }

  reorder(columnId: string, targetIndex: number): Observable<BoardColumn> {
    const body: ReorderBoardColumnRequestDto = { targetIndex };

    return this.api
      .patch<BoardColumnDto, ReorderBoardColumnRequestDto>(`columns/${columnId}/reorder`, body)
      .pipe(map(toBoardColumn));
  }

  private listTasksByColumn(columnId: string): Observable<readonly KanbanTask[]> {
    return this.api
      .get<KanbanTaskDto[]>(`columns/${columnId}/tasks`)
      .pipe(map((dtos) => dtos.map(toKanbanTask)));
  }
}
