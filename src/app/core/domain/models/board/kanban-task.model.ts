import { TaskPriority } from './task-priority.model';

export interface KanbanTask {
  readonly id: string;
  readonly reference: string;
  readonly title: string;
  readonly description: string;
  readonly priority: TaskPriority;
  readonly assigneeName: string;
  readonly columnId: string;
  readonly position: number;
  readonly createdAt: Date;
}
