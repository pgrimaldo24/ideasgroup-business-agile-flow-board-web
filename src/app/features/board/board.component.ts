import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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
    ReactiveFormsModule,
    AvatarComponent,
    BoardColumnComponent,
    ButtonComponent,
    DialogComponent,
    FormGroupComponent,
    TextInputComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
  private readonly formBuilder = inject(FormBuilder);

  @Input() projectId = '';

  protected readonly projectName = BOARD_PLACEHOLDER.projectName;
  protected readonly columns = signal<readonly BoardColumn[]>(BOARD_PLACEHOLDER.columns);
  protected readonly tasks = signal<readonly KanbanTask[]>(BOARD_PLACEHOLDER.tasks);
  protected readonly members = BOARD_PLACEHOLDER.members;

  protected readonly dialogVisible = signal(false);

  protected readonly titleErrors = BoardMessages.title;
  protected readonly assigneeErrors = BoardMessages.assignee;

  protected readonly search = this.formBuilder.nonNullable.control('');

  private readonly searchTerm = toSignal(this.search.valueChanges, { initialValue: '' });

  protected readonly taskForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required]],
    assigneeName: ['', [Validators.required]]
  });

  private readonly targetColumn = signal<BoardColumn | null>(null);

  protected readonly visibleTasks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.tasks();
    }

    return this.tasks().filter((task) => task.title.toLowerCase().includes(term));
  });

  protected tasksOf(column: BoardColumn): readonly KanbanTask[] {
    return this.visibleTasks()
      .filter((task) => task.columnId === column.id)
      .sort((left, right) => left.position - right.position);
  }

  protected openTaskDialog(column: BoardColumn): void {
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
    const existing = this.tasks().filter((task) => task.columnId === column.id);

    const created: KanbanTask = {
      id: crypto.randomUUID(),
      reference: `AFB-${this.tasks().length + 1}`,
      title,
      description: '',
      priority: 'medium',
      assigneeName,
      columnId: column.id,
      position: existing.length,
      createdAt: new Date()
    };

    this.tasks.update((tasks) => [...tasks, created]);
    this.closeTaskDialog();
  }
}
