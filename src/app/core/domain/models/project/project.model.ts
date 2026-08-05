export type ProjectStatus = 'Planificado' | 'EnProgreso' | 'Pausado' | 'Completado' | 'Cancelado';

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  'Planificado',
  'EnProgreso',
  'Pausado',
  'Completado',
  'Cancelado'
];

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly startDate: Date;
  readonly expectedEndDate: Date;
  readonly status: ProjectStatus;
}
