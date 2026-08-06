import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { COLUMN_REPOSITORY_PORT } from '@core/application/ports/board/column-repository.port';
import { BoardColumn } from '@core/domain/models/board/board-column.model';

@Injectable({ providedIn: 'root' })
export class ReorderColumnUseCase {
  private readonly repository = inject(COLUMN_REPOSITORY_PORT);

  execute(columnId: string, targetIndex: number): Observable<BoardColumn> {
    return this.repository.reorder(columnId, targetIndex);
  }
}
