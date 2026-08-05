import { TaskPriority } from '@core/domain/models/board/task-priority.model';
import { TagSeverity } from '@shared/ui/tag/tag.component';

export class BoardMessages {
  static readonly priorityLabel: Record<TaskPriority, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta'
  };

  static readonly prioritySeverity: Record<TaskPriority, TagSeverity> = {
    low: 'neutral',
    medium: 'info',
    high: 'danger'
  };

  static readonly reorderFailed =
    'No se pudo guardar el nuevo orden. La tarea volvió a su posición anterior.';

  static readonly title: Record<string, string> = {
    required: 'El título de la tarea es obligatorio'
  };

  static readonly assignee: Record<string, string> = {
    required: 'Debes asignar un responsable'
  };
}
