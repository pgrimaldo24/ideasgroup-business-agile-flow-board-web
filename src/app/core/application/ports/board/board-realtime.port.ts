import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { KanbanTask } from '@core/domain/models/board/kanban-task.model';

export type BoardRealtimeEvent =
  | { readonly type: 'task-created'; readonly task: KanbanTask }
  | { readonly type: 'task-updated'; readonly task: KanbanTask }
  | { readonly type: 'task-moved'; readonly task: KanbanTask }
  | { readonly type: 'task-deleted'; readonly taskId: string };

export interface BoardRealtimePort {
  events(): Observable<BoardRealtimeEvent>;
  join(projectId: string): Promise<void>;
  leave(projectId: string): Promise<void>;
}

export const BOARD_REALTIME_PORT = new InjectionToken<BoardRealtimePort>('BOARD_REALTIME_PORT');
