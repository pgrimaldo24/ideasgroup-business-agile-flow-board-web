import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { BoardColumn } from '@core/domain/models/board/board-column.model';
import { KanbanTask } from '@core/domain/models/board/kanban-task.model';

export interface BoardSnapshot {
  readonly columns: readonly BoardColumn[];
  readonly tasks: readonly KanbanTask[];
}

export interface ColumnRepositoryPort {
  listByProject(projectId: string): Observable<BoardSnapshot>;
}

export const COLUMN_REPOSITORY_PORT = new InjectionToken<ColumnRepositoryPort>(
  'COLUMN_REPOSITORY_PORT'
);
