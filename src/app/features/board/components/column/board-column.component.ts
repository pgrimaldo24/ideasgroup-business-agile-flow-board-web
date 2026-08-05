import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { BoardColumn } from '@core/domain/models/board/board-column.model';
import { KanbanTask } from '@core/domain/models/board/kanban-task.model';
import { TaskMove } from '@core/domain/models/board/task-move.model';

import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [DragDropModule, TaskCardComponent],
  templateUrl: './board-column.component.html',
  styleUrl: './board-column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardColumnComponent {
  @Input({ required: true }) column!: BoardColumn;
  @Input() tasks: readonly KanbanTask[] = [];

  @Output() readonly taskSelected = new EventEmitter<KanbanTask>();
  @Output() readonly taskCreated = new EventEmitter<BoardColumn>();
  @Output() readonly taskMoved = new EventEmitter<TaskMove>();

  protected onDrop(event: CdkDragDrop<readonly KanbanTask[]>): void {
    const sameColumn = event.previousContainer === event.container;

    if (sameColumn && event.previousIndex === event.currentIndex) {
      return;
    }

    const moved = event.previousContainer.data[event.previousIndex];

    if (!moved) {
      return;
    }

    this.taskMoved.emit({
      taskId: moved.id,
      targetColumnId: this.column.id,
      targetIndex: event.currentIndex
    });
  }
}
