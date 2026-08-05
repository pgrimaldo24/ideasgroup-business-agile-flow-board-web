import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PROJECT_REPOSITORY_PORT } from '@core/application/ports/project/project-repository.port';
import { ProjectDraft } from '@core/domain/models/project/project-draft.model';
import { Project } from '@core/domain/models/project/project.model';

@Injectable({ providedIn: 'root' })
export class CreateProjectUseCase {
  private readonly repository = inject(PROJECT_REPOSITORY_PORT);

  execute(draft: ProjectDraft): Observable<Project> {
    return this.repository.create(draft);
  }
}
