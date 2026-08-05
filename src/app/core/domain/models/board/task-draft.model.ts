import { TaskPriority } from './task-priority.model';

export interface TaskDraft {
  readonly title: string;
  readonly description: string;
  readonly priority: TaskPriority;
  readonly assigneeName: string;
}
