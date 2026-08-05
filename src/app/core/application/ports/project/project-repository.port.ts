import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { PageQuery, PagedResult } from '@core/domain/models/pagination/paged-result.model';
import { ProjectDraft } from '@core/domain/models/project/project-draft.model';
import { Project } from '@core/domain/models/project/project.model';

export interface ProjectRepositoryPort {
  search(query: PageQuery): Observable<PagedResult<Project>>;
  create(draft: ProjectDraft): Observable<Project>;
}

export const PROJECT_REPOSITORY_PORT = new InjectionToken<ProjectRepositoryPort>(
  'PROJECT_REPOSITORY_PORT'
);
