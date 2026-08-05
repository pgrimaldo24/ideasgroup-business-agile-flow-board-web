import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BoardSnapshot, COLUMN_REPOSITORY_PORT } from '@core/application/ports/board/column-repository.port';

@Injectable({ providedIn: 'root' })
export class LoadBoardUseCase {
  private readonly columns = inject(COLUMN_REPOSITORY_PORT);

  execute(projectId: string): Observable<BoardSnapshot> {
    return this.columns.listByProject(projectId);
  }
}
