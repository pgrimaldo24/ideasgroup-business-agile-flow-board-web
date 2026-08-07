import { HttpErrorResponse } from '@angular/common/http';

import { TaskPriority } from '@core/domain/models/board/task-priority.model';
import { TagSeverity } from '@shared/ui/tag/tag.component';

export class BoardMessages {
  static readonly columnHasTasks = 'No se puede eliminar la columna porque contiene tareas.';
  static readonly deleteColumnFailed = 'No se pudo eliminar la columna. Inténtalo de nuevo.';
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

  static readonly columnReorderFailed =
    'No se pudo guardar el nuevo orden de la columna. Volvió a su posición anterior.';

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

  static readonly reportDownloadFailed = 'No se pudo descargar el reporte. Inténtalo de nuevo.';

  static deleteColumnErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 409) {
      const body = error.error as { message?: string; detail?: string } | null;

      return body?.message ?? body?.detail ?? BoardMessages.columnHasTasks;
    }

    return BoardMessages.deleteColumnFailed;
  }
}
