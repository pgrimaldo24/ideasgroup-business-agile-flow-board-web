import { ProjectStatus } from '@core/domain/models/project/project.model';

export class ProjectsMessages {
  static readonly statusLabel: Record<ProjectStatus, string> = {
    Planificado: 'Planificado',
    EnProgreso: 'En progreso',
    Pausado: 'Pausado',
    Completado: 'Completado',
    Cancelado: 'Cancelado'
  };

  static readonly projectName: Record<string, string> = {
    required: 'El nombre del proyecto es obligatorio'
  };

  static readonly dates: Record<string, string> = {
    required: 'La fecha es obligatoria'
  };

  static readonly status: Record<string, string> = {
    required: 'Debes seleccionar un estado'
  };
}
