import { KanbanTask } from '@core/domain/models/board/kanban-task.model';
import { TaskMove } from '@core/domain/models/board/task-move.model';

export class TaskOrderingService {
  static move(tasks: readonly KanbanTask[], move: TaskMove): readonly KanbanTask[] {
    const moved = tasks.find((task) => task.id === move.taskId);

    if (!moved) {
      return tasks;
    }

    const others = tasks.filter((task) => task.id !== move.taskId);
    const target = TaskOrderingService.sortedColumn(others, move.targetColumnId);
    const index = Math.max(0, Math.min(move.targetIndex, target.length));

    target.splice(index, 0, { ...moved, columnId: move.targetColumnId });

    const source =
      moved.columnId === move.targetColumnId
        ? []
        : TaskOrderingService.sortedColumn(others, moved.columnId);

    const untouched = others.filter(
      (task) => task.columnId !== move.targetColumnId && task.columnId !== moved.columnId
    );

    return [
      ...untouched,
      ...TaskOrderingService.withPositions(target),
      ...TaskOrderingService.withPositions(source)
    ];
  }

  static nextPosition(tasks: readonly KanbanTask[], columnId: string): number {
    return tasks.filter((task) => task.columnId === columnId).length;
  }

  private static sortedColumn(tasks: readonly KanbanTask[], columnId: string): KanbanTask[] {
    return tasks
      .filter((task) => task.columnId === columnId)
      .sort((left, right) => left.position - right.position);
  }

  private static withPositions(tasks: readonly KanbanTask[]): KanbanTask[] {
    return tasks.map((task, position) => ({ ...task, position }));
  }
}
