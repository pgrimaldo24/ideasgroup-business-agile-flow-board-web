import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { TASK_REPOSITORY_PORT } from '@core/application/ports/board/task-repository.port';
import { KanbanTask } from '@core/domain/models/board/kanban-task.model';
import { TaskDraft } from '@core/domain/models/board/task-draft.model';

@Injectable({ providedIn: 'root' })
export class CreateTaskUseCase {
  private readonly repository = inject(TASK_REPOSITORY_PORT);

  execute(columnId: string, draft: TaskDraft): Observable<KanbanTask> {
    return this.repository.create(columnId, draft);
  }
}
