import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { AUTH_PORT } from '@core/application/ports/auth/auth.port';
import { SessionStore } from '@core/application/state/auth/session.store';
import { AuthenticatedSession } from '@core/domain/models/auth/authenticated-session.model';
import { Credentials } from '@core/domain/models/auth/credentials.model';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  private readonly auth = inject(AUTH_PORT);
  private readonly session = inject(SessionStore);

  execute(credentials: Credentials): Observable<AuthenticatedSession> {
    return this.auth.login(credentials).pipe(tap((session) => this.session.start(session)));
  }
}
