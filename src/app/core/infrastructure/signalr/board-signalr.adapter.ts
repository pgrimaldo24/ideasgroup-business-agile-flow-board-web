import { Injectable, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

import { BoardRealtimeEvent, BoardRealtimePort } from '@core/application/ports/board/board-realtime.port';
import { SessionStore } from '@core/application/state/auth/session.store';
import { APP_CONFIG } from '@core/infrastructure/config/app-config.token';

import { toKanbanTask } from '../http/board/mappers/kanban-task.mapper';
import { KanbanTaskDto } from '../http/board/dto/kanban-task.dto';

@Injectable()
export class BoardSignalrAdapter implements BoardRealtimePort {
  private readonly config = inject(APP_CONFIG);
  private readonly session = inject(SessionStore);

  private readonly eventsSubject = new Subject<BoardRealtimeEvent>();
  private connection: signalR.HubConnection | null = null;
  private connectionReady: Promise<void> | null = null;

  events(): Observable<BoardRealtimeEvent> {
    return this.eventsSubject.asObservable();
  }

  async join(projectId: string): Promise<void> {
    const connection = await this.ensureConnection();

    await connection.invoke('SubscribeToBoard', projectId);
  }

  async leave(projectId: string): Promise<void> {
    if (!this.connection) {
      return;
    }

    if (this.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    await this.connection.invoke('UnsubscribeFromBoard', projectId);
  }

  private ensureConnection(): Promise<signalR.HubConnection> {
    if (this.connection && this.connectionReady) {
      return this.connectionReady.then(() => this.connection!);
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.config.realtimeHubUrl}/board`, {
        accessTokenFactory: () => this.session.token() ?? ''
      })
      .withAutomaticReconnect()
      .build();

    connection.on('TaskCreated', (dto: KanbanTaskDto) =>
      this.eventsSubject.next({ type: 'task-created', task: toKanbanTask(dto) })
    );

    connection.on('TaskUpdated', (dto: KanbanTaskDto) =>
      this.eventsSubject.next({ type: 'task-updated', task: toKanbanTask(dto) })
    );

    connection.on('TaskMoved', (dto: KanbanTaskDto) =>
      this.eventsSubject.next({ type: 'task-moved', task: toKanbanTask(dto) })
    );

    connection.on('TaskDeleted', (taskId: string) =>
      this.eventsSubject.next({ type: 'task-deleted', taskId })
    );

    this.connection = connection;
    this.connectionReady = connection.start();

    return this.connectionReady.then(() => connection);
  }
}
