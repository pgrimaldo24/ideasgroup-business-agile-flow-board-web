import { KanbanTaskDto } from './kanban-task.dto';

export interface BoardColumnDto {
  id: string;
  name: string;
  position: number;
  projectId: string;
  tasks: KanbanTaskDto[] | null;
}
