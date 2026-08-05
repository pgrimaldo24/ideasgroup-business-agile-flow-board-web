import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import {
  TASK_REPOSITORY_PORT,
  TaskRepositoryPort
} from '@core/application/ports/board/task-repository.port';
import { BoardColumn } from '@core/domain/models/board/board-column.model';
import { KanbanTask } from '@core/domain/models/board/kanban-task.model';
import { TaskMove } from '@core/domain/models/board/task-move.model';

import { BoardStore } from './board.store';

class FakeTaskRepository implements TaskRepositoryPort {
  response: Observable<void> = of(undefined);
  lastMove: TaskMove | null = null;

  reorder(move: TaskMove): Observable<void> {
    this.lastMove = move;

    return this.response;
  }
}

function task(id: string, columnId: string, position: number): KanbanTask {
  return {
    id,
    reference: `AFB-${id}`,
    title: `Tarea ${id}`,
    description: '',
    priority: 'medium',
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
  let repository: FakeTaskRepository;
  let store: BoardStore;

  beforeEach(() => {
    repository = new FakeTaskRepository();

    TestBed.configureTestingModule({
      providers: [BoardStore, { provide: TASK_REPOSITORY_PORT, useValue: repository }]
    });

    store = TestBed.inject(BoardStore);
    store.load(columns, tasks);
  });

  it('aplica el movimiento antes de que responda el servidor', () => {
    repository.response = of(undefined);

    store.moveTask({ taskId: 'a', targetColumnId: 'doing', targetIndex: 0 });

    const doing = store.tasksByColumn().get('doing') ?? [];

    expect(doing.map((item) => item.id)).toEqual(['a', 'c']);
    expect(store.reorderFailed()).toBeFalse();
  });

  it('envía al servidor la columna y el índice de destino', () => {
    store.moveTask({ taskId: 'a', targetColumnId: 'doing', targetIndex: 1 });

    expect(repository.lastMove).toEqual({
      taskId: 'a',
      targetColumnId: 'doing',
      targetIndex: 1
    });
  });

  it('revierte el movimiento y avisa cuando el servidor falla', () => {
    repository.response = throwError(() => new Error('500'));

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
});
