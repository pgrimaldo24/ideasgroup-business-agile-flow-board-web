import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { TaskRepositoryPort } from '@core/application/ports/board/task-repository.port';
import { TaskMove } from '@core/domain/models/board/task-move.model';
import { ApiClient } from '@core/infrastructure/http/api-client.service';

import { ReorderTaskRequestDto } from './dto/reorder-task-request.dto';

@Injectable()
export class TaskHttpAdapter implements TaskRepositoryPort {
  private readonly api = inject(ApiClient);

  reorder(move: TaskMove): Observable<void> {
    const body: ReorderTaskRequestDto = {
      targetColumnId: move.targetColumnId,
      targetIndex: move.targetIndex
    };

    return this.api
      .patch<unknown, ReorderTaskRequestDto>(`tasks/${move.taskId}/reorder`, body)
      .pipe(map(() => undefined));
  }
}
