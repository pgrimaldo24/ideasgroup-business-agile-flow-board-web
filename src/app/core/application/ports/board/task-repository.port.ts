import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { KanbanTask } from '@core/domain/models/board/kanban-task.model';
import { TaskDraft } from '@core/domain/models/board/task-draft.model';
import { TaskMove } from '@core/domain/models/board/task-move.model';

export interface TaskRepositoryPort {
  create(columnId: string, draft: TaskDraft): Observable<KanbanTask>;
  reorder(move: TaskMove): Observable<void>;
}

export const TASK_REPOSITORY_PORT = new InjectionToken<TaskRepositoryPort>('TASK_REPOSITORY_PORT');
