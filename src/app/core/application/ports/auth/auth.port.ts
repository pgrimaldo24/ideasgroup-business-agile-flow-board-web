import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticatedSession } from '@core/domain/models/auth/authenticated-session.model';
import { Credentials } from '@core/domain/models/auth/credentials.model';

export interface AuthPort {
  login(credentials: Credentials): Observable<AuthenticatedSession>;
}

export const AUTH_PORT = new InjectionToken<AuthPort>('AUTH_PORT');
