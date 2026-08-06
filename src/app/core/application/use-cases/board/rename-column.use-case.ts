import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { COLUMN_REPOSITORY_PORT } from '@core/application/ports/board/column-repository.port';
import { BoardColumn } from '@core/domain/models/board/board-column.model';

@Injectable({ providedIn: 'root' })
export class RenameColumnUseCase {
  private readonly repository = inject(COLUMN_REPOSITORY_PORT);

  execute(columnId: string, name: string): Observable<BoardColumn> {
    return this.repository.rename(columnId, name);
  }
}
