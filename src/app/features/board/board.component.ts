import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Input, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { BoardStore } from '@core/application/state/board/board.store';
import { BoardColumn } from '@core/domain/models/board/board-column.model';
import { KanbanTask } from '@core/domain/models/board/kanban-task.model';
import { AvatarComponent } from '@shared/ui/avatar/avatar.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { DialogComponent } from '@shared/ui/dialog/dialog.component';
import { FormGroupComponent } from '@shared/ui/form-group/form-group.component';
import { TextInputComponent } from '@shared/ui/text-input/text-input.component';

import { BoardColumnComponent } from './components/column/board-column.component';
import { BoardMessages } from './board-messages';
import { BOARD_PLACEHOLDER } from './board.placeholder';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    DragDropModule,
    ReactiveFormsModule,
    AvatarComponent,
    BoardColumnComponent,
    ButtonComponent,
    DialogComponent,
    FormGroupComponent,
    TextInputComponent
  ],
  providers: [BoardStore],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
  private readonly formBuilder = inject(FormBuilder);

  protected readonly store = inject(BoardStore);

  @Input() projectId = '';

  protected readonly projectName = BOARD_PLACEHOLDER.projectName;
  protected readonly members = BOARD_PLACEHOLDER.members;

  protected readonly dialogVisible = signal(false);

  protected readonly titleErrors = BoardMessages.title;
  protected readonly assigneeErrors = BoardMessages.assignee;
  protected readonly reorderError = BoardMessages.reorderFailed;

  protected readonly search = this.formBuilder.nonNullable.control('');

  protected readonly taskForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required]],
    assigneeName: ['', [Validators.required]]
  });

  private readonly targetColumn = signal<BoardColumn | null>(null);

  constructor() {
    this.store.load(BOARD_PLACEHOLDER.columns, BOARD_PLACEHOLDER.tasks);

    this.search.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((term) => this.store.search(term));
  }

  protected openTaskDialog(column: BoardColumn | undefined): void {
    if (!column) {
      return;
    }

    this.targetColumn.set(column);
    this.taskForm.reset();
    this.dialogVisible.set(true);
  }

  protected closeTaskDialog(): void {
    this.dialogVisible.set(false);
    this.targetColumn.set(null);
  }

  protected createTask(): void {
    const column = this.targetColumn();

    if (this.taskForm.invalid || !column) {
      this.taskForm.markAllAsTouched();

      return;
    }

    const { title, assigneeName } = this.taskForm.getRawValue();

    const created: KanbanTask = {
      id: crypto.randomUUID(),
      reference: `AFB-${this.store.tasks().length + 1}`,
      title,
      description: '',
      priority: 'medium',
      assigneeName,
      columnId: column.id,
      position: this.store.nextPosition(column.id),
      createdAt: new Date()
    };

    this.store.addTask(created);
    this.closeTaskDialog();
  }
}
