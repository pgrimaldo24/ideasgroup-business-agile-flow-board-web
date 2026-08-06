import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { COLUMN_REPOSITORY_PORT } from '@core/application/ports/board/column-repository.port';

@Injectable({ providedIn: 'root' })
export class DeleteColumnUseCase {
  private readonly repository = inject(COLUMN_REPOSITORY_PORT);

  execute(columnId: string): Observable<void> {
    return this.repository.delete(columnId);
  }
}
