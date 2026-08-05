import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ProjectListStore } from '@core/application/state/project/project-list.store';
import { PROJECT_STATUSES, ProjectStatus } from '@core/domain/models/project/project.model';
import { CardComponent } from '@shared/ui/card/card.component';
import { DialogComponent } from '@shared/ui/dialog/dialog.component';
import { FormGroupComponent } from '@shared/ui/form-group/form-group.component';
import { SelectInputComponent } from '@shared/ui/select-input/select-input.component';
import { SelectOption } from '@shared/ui/select-input/select-option.model';
import { TextInputComponent } from '@shared/ui/text-input/text-input.component';
import { PageToolbarHandlers, PageToolbarService } from '@layout/page-toolbar.service';

import { ProjectsMessages } from '../projects-messages';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    DialogComponent,
    FormGroupComponent,
    SelectInputComponent,
    TextInputComponent
  ],
  providers: [ProjectListStore],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements PageToolbarHandlers {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toolbar = inject(PageToolbarService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly store = inject(ProjectListStore);

  protected readonly dialogVisible = signal(false);

  protected readonly statusLabel = ProjectsMessages.statusLabel;

  protected readonly statusOptions: readonly SelectOption<ProjectStatus>[] = PROJECT_STATUSES.map(
    (status) => ({ label: ProjectsMessages.statusLabel[status], value: status })
  );

  protected readonly nameErrors = ProjectsMessages.projectName;
  protected readonly dateErrors = ProjectsMessages.dates;
  protected readonly statusErrors = ProjectsMessages.status;

  protected readonly projectForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
    startDate: [new Date(), [Validators.required]],
    expectedEndDate: [new Date(), [Validators.required]],
    status: ['Planificado' as ProjectStatus, [Validators.required]]
  });

  readonly searchPlaceholder = 'Buscar proyectos por nombre';
  readonly createLabel = 'Crear proyecto';

  constructor() {
    this.store.fetch(1);
    this.toolbar.register(this);
    this.destroyRef.onDestroy(() => this.toolbar.clear(this));
  }

  onSearch(term: string): void {
    this.store.search(term);
  }

  onCreate(): void {
    this.openCreateDialog();
  }

  protected openBoard(projectId: string): void {
    void this.router.navigate(['/projects', projectId, 'board']);
  }

  protected previousPage(): void {
    this.store.goToPage(Math.max(1, this.store.page() - 1));
  }

  protected nextPage(): void {
    this.store.goToPage(Math.min(this.store.totalPages(), this.store.page() + 1));
  }

  protected openCreateDialog(): void {
    this.projectForm.reset({
      name: '',
      description: '',
      startDate: new Date(),
      expectedEndDate: new Date(),
      status: 'Planificado'
    });
    this.dialogVisible.set(true);
  }

  protected closeCreateDialog(): void {
    this.dialogVisible.set(false);
  }

  protected createProject(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();

      return;
    }

    this.store.createProject(this.projectForm.getRawValue());
    this.closeCreateDialog();
  }
}
