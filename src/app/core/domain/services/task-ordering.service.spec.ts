import { KanbanTask } from '@core/domain/models/board/kanban-task.model';

import { TaskOrderingService } from './task-ordering.service';

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

function idsOf(tasks: readonly KanbanTask[], columnId: string): string[] {
  return tasks
    .filter((item) => item.columnId === columnId)
    .sort((left, right) => left.position - right.position)
    .map((item) => item.id);
}

describe('TaskOrderingService', () => {
  const board: readonly KanbanTask[] = [
    task('a', 'todo', 0),
    task('b', 'todo', 1),
    task('c', 'todo', 2),
    task('d', 'doing', 0),
    task('e', 'doing', 1)
  ];

  it('mueve una tarea hacia abajo dentro de la misma columna', () => {
    const result = TaskOrderingService.move(board, {
      taskId: 'a',
      targetColumnId: 'todo',
      targetIndex: 2
    });

    expect(idsOf(result, 'todo')).toEqual(['b', 'c', 'a']);
  });

  it('mueve una tarea hacia arriba dentro de la misma columna', () => {
    const result = TaskOrderingService.move(board, {
      taskId: 'c',
      targetColumnId: 'todo',
      targetIndex: 0
    });

    expect(idsOf(result, 'todo')).toEqual(['c', 'a', 'b']);
  });

  it('mueve una tarea a otra columna en la posición indicada', () => {
    const result = TaskOrderingService.move(board, {
      taskId: 'b',
      targetColumnId: 'doing',
      targetIndex: 1
    });

    expect(idsOf(result, 'doing')).toEqual(['d', 'b', 'e']);
    expect(idsOf(result, 'todo')).toEqual(['a', 'c']);
  });

  it('renumera la columna de origen sin dejar huecos', () => {
    const result = TaskOrderingService.move(board, {
      taskId: 'a',
      targetColumnId: 'doing',
      targetIndex: 0
    });

    const origin = result
      .filter((item) => item.columnId === 'todo')
      .sort((left, right) => left.position - right.position);

    expect(origin.map((item) => item.position)).toEqual([0, 1]);
  });

  it('mueve una tarea a una columna vacía', () => {
    const result = TaskOrderingService.move(board, {
      taskId: 'a',
      targetColumnId: 'done',
      targetIndex: 0
    });

    expect(idsOf(result, 'done')).toEqual(['a']);
    expect(result.find((item) => item.id === 'a')?.position).toBe(0);
  });

  it('acota un índice mayor que el tamaño de la columna destino', () => {
    const result = TaskOrderingService.move(board, {
      taskId: 'a',
      targetColumnId: 'doing',
      targetIndex: 99
    });

    expect(idsOf(result, 'doing')).toEqual(['d', 'e', 'a']);
  });

  it('conserva el total de tareas y no altera las columnas ajenas', () => {
    const result = TaskOrderingService.move(board, {
      taskId: 'a',
      targetColumnId: 'doing',
      targetIndex: 1
    });

    expect(result.length).toBe(board.length);
    expect(idsOf(result, 'doing')).toEqual(['d', 'a', 'e']);
  });

  it('devuelve la lista intacta si la tarea no existe', () => {
    const result = TaskOrderingService.move(board, {
      taskId: 'desconocida',
      targetColumnId: 'doing',
      targetIndex: 0
    });

    expect(result).toBe(board);
  });
});
