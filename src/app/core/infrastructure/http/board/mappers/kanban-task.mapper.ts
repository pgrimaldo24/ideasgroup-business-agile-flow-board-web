import { KanbanTask } from '@core/domain/models/board/kanban-task.model';
import { TaskPriority } from '@core/domain/models/board/task-priority.model';

import { CreateKanbanTaskRequestDto } from '../dto/create-kanban-task-request.dto';
import { KanbanTaskDto } from '../dto/kanban-task.dto';

export function toKanbanTask(dto: KanbanTaskDto): KanbanTask {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    priority: dto.priority as TaskPriority,
    assigneeName: dto.assigneeName,
    columnId: dto.columnId,
    position: dto.position,
    createdAt: new Date(dto.createdAtUtc)
  };
}

export function toCreateKanbanTaskRequest(
  title: string,
  description: string,
  priority: string,
  assigneeName: string
): CreateKanbanTaskRequestDto {
  return { title, description, priority, assigneeName };
}
