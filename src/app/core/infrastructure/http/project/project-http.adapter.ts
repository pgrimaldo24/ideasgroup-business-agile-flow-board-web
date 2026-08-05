import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ProjectRepositoryPort } from '@core/application/ports/project/project-repository.port';
import { PageQuery, PagedResult } from '@core/domain/models/pagination/paged-result.model';
import { ProjectDraft } from '@core/domain/models/project/project-draft.model';
import { Project } from '@core/domain/models/project/project.model';
import { ApiClient } from '@core/infrastructure/http/api-client.service';

import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { ProjectDto, ProjectDtoPagedResultDto } from './dto/project.dto';
import { toCreateProjectRequest, toPagedProjects, toProject } from './mappers/project.mapper';

@Injectable()
export class ProjectHttpAdapter implements ProjectRepositoryPort {
  private readonly api = inject(ApiClient);

  search(query: PageQuery): Observable<PagedResult<Project>> {
    let params = new HttpParams().set('page', query.page).set('pageSize', query.pageSize);

    if (query.name) {
      params = params.set('name', query.name);
    }

    return this.api
      .get<ProjectDtoPagedResultDto>('projects', params)
      .pipe(map(toPagedProjects));
  }

  create(draft: ProjectDraft): Observable<Project> {
    const body: CreateProjectRequestDto = toCreateProjectRequest(draft);

    return this.api.post<ProjectDto, CreateProjectRequestDto>('projects', body).pipe(map(toProject));
  }
}
