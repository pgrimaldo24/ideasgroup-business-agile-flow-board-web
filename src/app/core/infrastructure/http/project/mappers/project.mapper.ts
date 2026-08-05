import { PagedResult } from '@core/domain/models/pagination/paged-result.model';
import { ProjectDraft } from '@core/domain/models/project/project-draft.model';
import { Project, ProjectStatus } from '@core/domain/models/project/project.model';

import { CreateProjectRequestDto } from '../dto/create-project-request.dto';
import { ProjectDto, ProjectDtoPagedResultDto } from '../dto/project.dto';

export function toProject(dto: ProjectDto): Project {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    startDate: new Date(dto.startDate),
    expectedEndDate: new Date(dto.expectedEndDate),
    status: dto.status as ProjectStatus
  };
}

export function toPagedProjects(dto: ProjectDtoPagedResultDto): PagedResult<Project> {
  return {
    items: dto.items.map(toProject),
    page: dto.page,
    pageSize: dto.pageSize,
    totalCount: dto.totalCount
  };
}

export function toCreateProjectRequest(draft: ProjectDraft): CreateProjectRequestDto {
  return {
    name: draft.name,
    description: draft.description,
    startDate: draft.startDate.toISOString(),
    expectedEndDate: draft.expectedEndDate.toISOString(),
    status: draft.status
  };
}
