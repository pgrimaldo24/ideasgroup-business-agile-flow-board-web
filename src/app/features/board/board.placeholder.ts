import { BoardColumn } from '@core/domain/models/board/board-column.model';
import { KanbanTask } from '@core/domain/models/board/kanban-task.model';

interface BoardPlaceholder {
  readonly projectName: string;
  readonly members: readonly string[];
  readonly columns: readonly BoardColumn[];
  readonly tasks: readonly KanbanTask[];
}

const PROJECT_ID = 'placeholder-project';

export const BOARD_PLACEHOLDER: BoardPlaceholder = {
  projectName: 'Desarrollo de producto',
  members: ['Ana Torres', 'Luis Salazar', 'Carla Méndez', 'Diego Ponce'],
  columns: [
    { id: 'backlog', projectId: PROJECT_ID, name: 'Backlog', position: 0 },
    { id: 'design', projectId: PROJECT_ID, name: 'Diseño', position: 1 },
    { id: 'ready', projectId: PROJECT_ID, name: 'Listo para desarrollo', position: 2 },
    { id: 'review', projectId: PROJECT_ID, name: 'Revisión de código', position: 3 },
    { id: 'done', projectId: PROJECT_ID, name: 'Terminado', position: 4 }
  ],
  tasks: [
    {
      id: 'task-1',
      reference: 'AFB-47',
      title: 'Optimizar el rendimiento de la vista de descubrimiento',
      description: '',
      priority: 'high',
      assigneeName: 'Ana Torres',
      columnId: 'backlog',
      position: 0,
      createdAt: new Date('2026-07-28T09:00:00Z')
    },
    {
      id: 'task-2',
      reference: 'AFB-48',
      title: 'Auditar la accesibilidad del proceso de pago',
      description: '',
      priority: 'medium',
      assigneeName: 'Carla Méndez',
      columnId: 'backlog',
      position: 1,
      createdAt: new Date('2026-07-28T10:30:00Z')
    },
    {
      id: 'task-3',
      reference: 'AFB-52',
      title: 'Flujo de incorporación de nuevos usuarios',
      description: '',
      priority: 'high',
      assigneeName: 'Luis Salazar',
      columnId: 'design',
      position: 0,
      createdAt: new Date('2026-07-29T08:15:00Z')
    },
    {
      id: 'task-4',
      reference: 'AFB-39',
      title: 'Estandarizar las insignias de la aplicación móvil',
      description: '',
      priority: 'low',
      assigneeName: 'Carla Méndez',
      columnId: 'design',
      position: 1,
      createdAt: new Date('2026-07-29T11:00:00Z')
    },
    {
      id: 'task-5',
      reference: 'AFB-10',
      title: 'Finalizar la página de campaña de temporada',
      description: '',
      priority: 'medium',
      assigneeName: 'Ana Torres',
      columnId: 'design',
      position: 2,
      createdAt: new Date('2026-07-30T14:45:00Z')
    },
    {
      id: 'task-6',
      reference: 'AFB-8',
      title: 'Implementar la reproducción de vídeo en la ficha de producto',
      description: '',
      priority: 'medium',
      assigneeName: 'Diego Ponce',
      columnId: 'ready',
      position: 0,
      createdAt: new Date('2026-07-31T09:20:00Z')
    },
    {
      id: 'task-7',
      reference: 'AFB-3',
      title: 'Refactorizar el reporte de inventario en tiempo real',
      description: '',
      priority: 'high',
      assigneeName: 'Luis Salazar',
      columnId: 'review',
      position: 0,
      createdAt: new Date('2026-08-01T07:50:00Z')
    },
    {
      id: 'task-8',
      reference: 'AFB-45',
      title: 'Sincronizar las cachés de inventario entre regiones',
      description: '',
      priority: 'medium',
      assigneeName: 'Diego Ponce',
      columnId: 'review',
      position: 1,
      createdAt: new Date('2026-08-01T10:05:00Z')
    },
    {
      id: 'task-9',
      reference: 'AFB-6',
      title: 'Corregir la vulnerabilidad de la pasarela de pago',
      description: '',
      priority: 'high',
      assigneeName: 'Ana Torres',
      columnId: 'review',
      position: 2,
      createdAt: new Date('2026-08-02T12:00:00Z')
    },
    {
      id: 'task-10',
      reference: 'AFB-21',
      title: 'Migrar la autenticación a tokens JWT',
      description: '',
      priority: 'low',
      assigneeName: 'Carla Méndez',
      columnId: 'done',
      position: 0,
      createdAt: new Date('2026-07-20T16:30:00Z')
    }
  ]
};
