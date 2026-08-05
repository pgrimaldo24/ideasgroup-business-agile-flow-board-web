import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CreateProjectUseCase } from '@core/application/use-cases/project/create-project.use-case';
import { SearchProjectsUseCase } from '@core/application/use-cases/project/search-projects.use-case';
import { ProjectDraft } from '@core/domain/models/project/project-draft.model';
import { Project } from '@core/domain/models/project/project.model';

const PAGE_SIZE = 20;

@Injectable()
export class ProjectListStore {
  private readonly searchProjects = inject(SearchProjectsUseCase);
  private readonly createProjectUseCase = inject(CreateProjectUseCase);
  private readonly destroyRef = inject(DestroyRef);

  private readonly projectsState = signal<readonly Project[]>([]);
  private readonly pageState = signal(1);
  private readonly totalCountState = signal(0);
  private readonly nameFilterState = signal('');
  private readonly loadingState = signal(false);

  readonly projects = this.projectsState.asReadonly();
  readonly page = this.pageState.asReadonly();
  readonly totalCount = this.totalCountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();

  readonly pageSize = PAGE_SIZE;

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalCountState() / PAGE_SIZE)));

  search(name: string): void {
    this.nameFilterState.set(name);
    this.fetch(1);
  }

  goToPage(page: number): void {
    this.fetch(page);
  }

  createProject(draft: ProjectDraft): void {
    this.createProjectUseCase
      .execute(draft)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.fetch(1));
  }

  fetch(page: number): void {
    this.loadingState.set(true);

    this.searchProjects
      .execute({ page, pageSize: PAGE_SIZE, name: this.nameFilterState() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.projectsState.set(result.items);
          this.pageState.set(result.page);
          this.totalCountState.set(result.totalCount);
          this.loadingState.set(false);
        },
        error: () => this.loadingState.set(false)
      });
  }
}
