import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { TaskMove } from '@core/domain/models/board/task-move.model';

export interface TaskRepositoryPort {
  reorder(move: TaskMove): Observable<void>;
}

export const TASK_REPOSITORY_PORT = new InjectionToken<TaskRepositoryPort>('TASK_REPOSITORY_PORT');
