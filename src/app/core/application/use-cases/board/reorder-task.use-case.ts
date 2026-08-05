import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { TASK_REPOSITORY_PORT } from '@core/application/ports/board/task-repository.port';
import { TaskMove } from '@core/domain/models/board/task-move.model';

@Injectable({ providedIn: 'root' })
export class ReorderTaskUseCase {
  private readonly repository = inject(TASK_REPOSITORY_PORT);

  execute(move: TaskMove): Observable<void> {
    return this.repository.reorder(move);
  }
}
