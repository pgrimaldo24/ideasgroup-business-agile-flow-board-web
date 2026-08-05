import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PROJECT_REPOSITORY_PORT } from '@core/application/ports/project/project-repository.port';
import { PageQuery, PagedResult } from '@core/domain/models/pagination/paged-result.model';
import { Project } from '@core/domain/models/project/project.model';

@Injectable({ providedIn: 'root' })
export class SearchProjectsUseCase {
  private readonly repository = inject(PROJECT_REPOSITORY_PORT);

  execute(query: PageQuery): Observable<PagedResult<Project>> {
    return this.repository.search(query);
  }
}
