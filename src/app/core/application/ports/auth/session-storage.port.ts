import { InjectionToken } from '@angular/core';

import { AuthenticatedSession } from '@core/domain/models/auth/authenticated-session.model';

export interface SessionStoragePort {
  save(session: AuthenticatedSession): void;
  read(): AuthenticatedSession | null;
  clear(): void;
}

export const SESSION_STORAGE_PORT = new InjectionToken<SessionStoragePort>('SESSION_STORAGE_PORT');
