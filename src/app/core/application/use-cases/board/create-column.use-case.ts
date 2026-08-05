import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { COLUMN_REPOSITORY_PORT } from '@core/application/ports/board/column-repository.port';
import { BoardColumn } from '@core/domain/models/board/board-column.model';
import { ColumnDraft } from '@core/domain/models/board/column-draft.model';

@Injectable({ providedIn: 'root' })
export class CreateColumnUseCase {
  private readonly repository = inject(COLUMN_REPOSITORY_PORT);

  execute(projectId: string, draft: ColumnDraft): Observable<BoardColumn> {
    return this.repository.create(projectId, draft);
  }
}
