export type ProjectStatus = 'active' | 'paused' | 'completed';

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly startDate: Date;
  readonly estimatedEndDate: Date;
  readonly status: ProjectStatus;
}
