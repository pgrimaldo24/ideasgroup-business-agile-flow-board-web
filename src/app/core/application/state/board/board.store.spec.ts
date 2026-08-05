import { TestBed } from '@angular/core/testing';
import { Observable, Subject, of, throwError } from 'rxjs';

import { BOARD_REALTIME_PORT, BoardRealtimeEvent, BoardRealtimePort } from '@core/application/ports/board/board-realtime.port';
import { BoardSnapshot, COLUMN_REPOSITORY_PORT, ColumnRepositoryPort } from '@core/application/ports/board/column-repository.port';
import { TASK_REPOSITORY_PORT, TaskRepositoryPort } from '@core/application/ports/board/task-repository.port';
import { BoardColumn } from '@core/domain/models/board/board-column.model';
import { ColumnDraft } from '@core/domain/models/board/column-draft.model';
import { KanbanTask } from '@core/domain/models/board/kanban-task.model';
import { TaskDraft } from '@core/domain/models/board/task-draft.model';
import { TaskMove } from '@core/domain/models/board/task-move.model';

import { BoardStore } from './board.store';

class FakeColumnRepository implements ColumnRepositoryPort {
  snapshot: BoardSnapshot = { columns: [], tasks: [] };
  createResponse: Observable<BoardColumn> | null = null;
  lastCreate: { projectId: string; draft: ColumnDraft } | null = null;

  listByProject(): Observable<BoardSnapshot> {
    return of(this.snapshot);
  }

  create(projectId: string, draft: ColumnDraft): Observable<BoardColumn> {
    this.lastCreate = { projectId, draft };

    return (
      this.createResponse ??
      of({ id: 'new-column', projectId, name: draft.name, position: 2 })
    );
  }
}

class FakeTaskRepository implements TaskRepositoryPort {
  reorderResponse: Observable<void> = of(undefined);
  createResponse: ((draft: TaskDraft) => KanbanTask) | null = null;
  lastMove: TaskMove | null = null;

  create(columnId: string, draft: TaskDraft): Observable<KanbanTask> {
    const created = this.createResponse
      ? this.createResponse(draft)
      : task('created', columnId, 0);

    return of(created);
  }

  reorder(move: TaskMove): Observable<void> {
    this.lastMove = move;

    return this.reorderResponse;
  }
}

class FakeRealtime implements BoardRealtimePort {
  private readonly subject = new Subject<BoardRealtimeEvent>();
  joined: string | null = null;
  left: string | null = null;

  events(): Observable<BoardRealtimeEvent> {
    return this.subject.asObservable();
  }

  async join(projectId: string): Promise<void> {
    this.joined = projectId;
  }

  async leave(projectId: string): Promise<void> {
    this.left = projectId;
  }

  emit(event: BoardRealtimeEvent): void {
    this.subject.next(event);
  }
}

function task(id: string, columnId: string, position: number): KanbanTask {
  return {
    id,
    title: `Tarea ${id}`,
    description: '',
    priority: 'Media',
    assigneeName: 'Ana Torres',
    columnId,
    position,
    createdAt: new Date('2026-08-01T00:00:00Z')
  };
}

const columns: readonly BoardColumn[] = [
  { id: 'todo', projectId: 'p1', name: 'Por hacer', position: 0 },
  { id: 'doing', projectId: 'p1', name: 'En curso', position: 1 }
];

const tasks: readonly KanbanTask[] = [
  task('a', 'todo', 0),
  task('b', 'todo', 1),
  task('c', 'doing', 0)
];

describe('BoardStore', () => {
  let columnRepository: FakeColumnRepository;
  let taskRepository: FakeTaskRepository;
  let realtime: FakeRealtime;
  let store: BoardStore;

  beforeEach(() => {
    columnRepository = new FakeColumnRepository();
    columnRepository.snapshot = { columns, tasks };
    taskRepository = new FakeTaskRepository();
    realtime = new FakeRealtime();

    TestBed.configureTestingModule({
      providers: [
        BoardStore,
        { provide: COLUMN_REPOSITORY_PORT, useValue: columnRepository },
        { provide: TASK_REPOSITORY_PORT, useValue: taskRepository },
        { provide: BOARD_REALTIME_PORT, useValue: realtime }
      ]
    });

    store = TestBed.inject(BoardStore);
    store.connect('p1');
  });

  it('carga las columnas y tareas del proyecto al conectar', () => {
    const doing = store.tasksByColumn().get('doing') ?? [];

    expect(store.columns().map((column) => column.id)).toEqual(['todo', 'doing']);
    expect(doing.map((item) => item.id)).toEqual(['c']);
  });

  it('se une al canal de tiempo real del proyecto', () => {
    expect(realtime.joined).toBe('p1');
  });

  it('aplica el movimiento antes de que responda el servidor', () => {
    taskRepository.reorderResponse = of(undefined);

    store.moveTask({ taskId: 'a', targetColumnId: 'doing', targetIndex: 0 });

    const doing = store.tasksByColumn().get('doing') ?? [];

    expect(doing.map((item) => item.id)).toEqual(['a', 'c']);
    expect(store.reorderFailed()).toBeFalse();
  });

  it('envía al servidor la columna y el índice de destino', () => {
    store.moveTask({ taskId: 'a', targetColumnId: 'doing', targetIndex: 1 });

    expect(taskRepository.lastMove).toEqual({
      taskId: 'a',
      targetColumnId: 'doing',
      targetIndex: 1
    });
  });

  it('revierte el movimiento y avisa cuando el servidor falla', () => {
    taskRepository.reorderResponse = throwError(() => new Error('500'));

    store.moveTask({ taskId: 'a', targetColumnId: 'doing', targetIndex: 0 });

    const todo = store.tasksByColumn().get('todo') ?? [];
    const doing = store.tasksByColumn().get('doing') ?? [];

    expect(todo.map((item) => item.id)).toEqual(['a', 'b']);
    expect(doing.map((item) => item.id)).toEqual(['c']);
    expect(store.reorderFailed()).toBeTrue();
  });

  it('filtra las tareas por el término de búsqueda', () => {
    store.search('Tarea b');

    expect((store.tasksByColumn().get('todo') ?? []).map((item) => item.id)).toEqual(['b']);
  });

  it('incorpora una tarea creada por otra sesión', () => {
    realtime.emit({ type: 'task-created', task: task('remote', 'todo', 2) });

    const todo = store.tasksByColumn().get('todo') ?? [];

    expect(todo.map((item) => item.id)).toEqual(['a', 'b', 'remote']);
  });

  it('aplica el movimiento remoto de una tarea sin volver a llamar al servidor', () => {
    realtime.emit({ type: 'task-moved', task: task('c', 'todo', 2) });

    const todo = store.tasksByColumn().get('todo') ?? [];
    const doing = store.tasksByColumn().get('doing') ?? [];

    expect(todo.map((item) => item.id)).toEqual(['a', 'b', 'c']);
    expect(doing.map((item) => item.id)).toEqual([]);
  });

  it('elimina una tarea borrada por otra sesión', () => {
    realtime.emit({ type: 'task-deleted', taskId: 'a' });

    const todo = store.tasksByColumn().get('todo') ?? [];

    expect(todo.map((item) => item.id)).toEqual(['b']);
  });

  it('añade una columna al proyecto conectado', () => {
    columnRepository.createResponse = of({
      id: 'qa',
      projectId: 'p1',
      name: 'QA',
      position: 2
    });

    store.createColumn({ name: 'QA' });

    expect(columnRepository.lastCreate).toEqual({ projectId: 'p1', draft: { name: 'QA' } });
    expect(store.columns().map((column) => column.id)).toEqual(['todo', 'doing', 'qa']);
    expect(store.creatingColumn()).toBeFalse();
  });

  it('marca creatingColumn mientras la petición está en curso', () => {
    const subject = new Subject<BoardColumn>();
    columnRepository.createResponse = subject.asObservable();

    store.createColumn({ name: 'QA' });

    expect(store.creatingColumn()).toBeTrue();

    subject.next({ id: 'qa', projectId: 'p1', name: 'QA', position: 2 });
    subject.complete();

    expect(store.creatingColumn()).toBeFalse();
  });

  it('deja de crear la columna si el servidor falla', () => {
    columnRepository.createResponse = throwError(() => new Error('500'));

    store.createColumn({ name: 'QA' });

    expect(store.columns().map((column) => column.id)).toEqual(['todo', 'doing']);
    expect(store.creatingColumn()).toBeFalse();
  });
});
