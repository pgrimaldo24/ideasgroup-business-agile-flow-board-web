import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { TaskRepositoryPort } from '@core/application/ports/board/task-repository.port';
import { KanbanTask } from '@core/domain/models/board/kanban-task.model';
import { TaskDraft } from '@core/domain/models/board/task-draft.model';
import { TaskMove } from '@core/domain/models/board/task-move.model';
import { ApiClient } from '@core/infrastructure/http/api-client.service';

import { CreateKanbanTaskRequestDto } from './dto/create-kanban-task-request.dto';
import { KanbanTaskDto } from './dto/kanban-task.dto';
import { ReorderTaskRequestDto } from './dto/reorder-task-request.dto';
import { toKanbanTask } from './mappers/kanban-task.mapper';

@Injectable()
export class TaskHttpAdapter implements TaskRepositoryPort {
  private readonly api = inject(ApiClient);

  create(columnId: string, draft: TaskDraft): Observable<KanbanTask> {
    const body: CreateKanbanTaskRequestDto = {
      title: draft.title,
      description: draft.description,
      priority: draft.priority,
      assigneeName: draft.assigneeName
    };

    return this.api
      .post<KanbanTaskDto, CreateKanbanTaskRequestDto>(`columns/${columnId}/tasks`, body)
      .pipe(map(toKanbanTask));
  }

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
