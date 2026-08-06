import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { BoardStore } from '@core/application/state/board/board.store';
import { BoardColumn } from '@core/domain/models/board/board-column.model';
import { KanbanTask } from '@core/domain/models/board/kanban-task.model';
import { TaskMove } from '@core/domain/models/board/task-move.model';
import { TextInputComponent } from '@shared/ui/text-input/text-input.component';

import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [DragDropModule, ReactiveFormsModule, TaskCardComponent, TextInputComponent],
  templateUrl: './board-column.component.html',
  styleUrl: './board-column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardColumnComponent {
  private readonly store = inject(BoardStore);

  @Input({ required: true }) column!: BoardColumn;
  @Input() tasks: readonly KanbanTask[] = [];

  @Output() readonly taskSelected = new EventEmitter<KanbanTask>();
  @Output() readonly taskCreated = new EventEmitter<BoardColumn>();
  @Output() readonly taskMoved = new EventEmitter<TaskMove>();
  @Output() readonly deleteRequested = new EventEmitter<BoardColumn>();

  protected readonly editing = signal(false);
  protected readonly renaming = signal(false);
  protected readonly nameControl = new FormControl('', { nonNullable: true });

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

  protected startEditing(): void {
    this.nameControl.setValue(this.column.name);
    this.editing.set(true);
  }

  protected confirmRename(): void {
    const name = this.nameControl.value.trim();

    if (!name || name === this.column.name) {
      this.editing.set(false);

      return;
    }

    this.renaming.set(true);

    this.store.renameColumn(this.column.id, name).subscribe({
      next: () => {
        this.renaming.set(false);
        this.editing.set(false);
      },
      error: () => {
        this.nameControl.setValue(this.column.name);
        this.renaming.set(false);
        this.editing.set(false);
      }
    });
  }
}
