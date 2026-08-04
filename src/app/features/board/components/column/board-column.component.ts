import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { BoardColumn } from '@core/domain/models/board/board-column.model';
import { KanbanTask } from '@core/domain/models/board/kanban-task.model';

import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [TaskCardComponent],
  templateUrl: './board-column.component.html',
  styleUrl: './board-column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardColumnComponent {
  @Input({ required: true }) column!: BoardColumn;
  @Input() tasks: readonly KanbanTask[] = [];

  @Output() readonly taskSelected = new EventEmitter<KanbanTask>();
  @Output() readonly taskCreated = new EventEmitter<BoardColumn>();
}
