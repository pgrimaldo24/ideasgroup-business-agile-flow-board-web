import { Injectable, inject } from '@angular/core';

import { SessionStore } from '@core/application/state/auth/session.store';

@Injectable({ providedIn: 'root' })
export class LogoutUseCase {
  private readonly session = inject(SessionStore);

  execute(): void {
    this.session.clear();
  }
}
