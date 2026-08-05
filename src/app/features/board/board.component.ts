import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { BoardStore } from '@core/application/state/board/board.store';
import { BoardColumn } from '@core/domain/models/board/board-column.model';
import { TASK_PRIORITIES, TaskPriority } from '@core/domain/models/board/task-priority.model';
import { DialogComponent } from '@shared/ui/dialog/dialog.component';
import { FormGroupComponent } from '@shared/ui/form-group/form-group.component';
import { SelectInputComponent } from '@shared/ui/select-input/select-input.component';
import { SelectOption } from '@shared/ui/select-input/select-option.model';
import { TextInputComponent } from '@shared/ui/text-input/text-input.component';
import { PageToolbarHandlers, PageToolbarService } from '@layout/page-toolbar.service';

import { BoardColumnComponent } from './components/column/board-column.component';
import { BoardMessages } from './board-messages';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    DragDropModule,
    ReactiveFormsModule,
    BoardColumnComponent,
    DialogComponent,
    FormGroupComponent,
    SelectInputComponent,
    TextInputComponent
  ],
  providers: [BoardStore],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements PageToolbarHandlers, OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly toolbar = inject(PageToolbarService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly store = inject(BoardStore);

  @Input() projectId = '';

  protected readonly dialogVisible = signal(false);
  protected readonly columnDialogVisible = signal(false);

  protected readonly titleErrors = BoardMessages.title;
  protected readonly assigneeErrors = BoardMessages.assignee;
  protected readonly priorityErrors = BoardMessages.priority;
  protected readonly columnNameErrors = BoardMessages.columnName;
  protected readonly reorderError = BoardMessages.reorderFailed;

  protected readonly priorityOptions: readonly SelectOption<TaskPriority>[] = TASK_PRIORITIES.map(
    (priority) => ({ label: BoardMessages.priorityLabel[priority], value: priority })
  );

  protected readonly taskForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    assigneeName: ['', [Validators.required]],
    priority: ['Media' as TaskPriority, [Validators.required]]
  });

  protected readonly columnForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]]
  });

  private readonly targetColumn = signal<BoardColumn | null>(null);

  readonly searchPlaceholder = 'Buscar en el tablero';
  readonly createLabel = 'Crear tarea';
  readonly createDisabled = computed(() => this.store.loading() || this.store.columns().length === 0);

  constructor() {
    this.toolbar.register(this);
    this.destroyRef.onDestroy(() => this.toolbar.clear(this));
  }

  ngOnInit(): void {
    this.store.connect(this.projectId);
  }

  onSearch(term: string): void {
    this.store.search(term);
  }

  onCreate(): void {
    this.openTaskDialog(this.store.columns()[0]);
  }

  protected openTaskDialog(column: BoardColumn | undefined): void {
    if (!column) {
      return;
    }

    this.targetColumn.set(column);
    this.taskForm.reset({ priority: 'Media', title: '', description: '', assigneeName: '' });
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

    this.store.createTask(column.id, this.taskForm.getRawValue());
    this.closeTaskDialog();
  }

  protected openColumnDialog(): void {
    this.columnForm.reset({ name: '' });
    this.columnDialogVisible.set(true);
  }

  protected closeColumnDialog(): void {
    this.columnDialogVisible.set(false);
  }

  protected createColumn(): void {
    if (this.columnForm.invalid) {
      this.columnForm.markAllAsTouched();

      return;
    }

    this.store.createColumn(this.columnForm.getRawValue());
    this.closeColumnDialog();
  }
}
