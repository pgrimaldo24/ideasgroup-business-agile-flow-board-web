import { ProjectStatus } from './project.model';

export interface ProjectDraft {
  readonly name: string;
  readonly description: string;
  readonly startDate: Date;
  readonly expectedEndDate: Date;
  readonly status: ProjectStatus;
}
