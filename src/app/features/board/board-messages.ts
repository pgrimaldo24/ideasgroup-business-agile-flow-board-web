import { TaskPriority } from '@core/domain/models/board/task-priority.model';
import { TagSeverity } from '@shared/ui/tag/tag.component';

export class BoardMessages {
  static readonly priorityLabel: Record<TaskPriority, string> = {
    Baja: 'Baja',
    Media: 'Media',
    Alta: 'Alta',
    Urgente: 'Urgente'
  };

  static readonly prioritySeverity: Record<TaskPriority, TagSeverity> = {
    Baja: 'neutral',
    Media: 'info',
    Alta: 'warning',
    Urgente: 'danger'
  };

  static readonly reorderFailed =
    'No se pudo guardar el nuevo orden. La tarea volvió a su posición anterior.';

  static readonly title: Record<string, string> = {
    required: 'El título de la tarea es obligatorio'
  };

  static readonly assignee: Record<string, string> = {
    required: 'Debes asignar un responsable'
  };

  static readonly priority: Record<string, string> = {
    required: 'Debes seleccionar una prioridad'
  };

  static readonly columnName: Record<string, string> = {
    required: 'El nombre de la columna es obligatorio'
  };
}
