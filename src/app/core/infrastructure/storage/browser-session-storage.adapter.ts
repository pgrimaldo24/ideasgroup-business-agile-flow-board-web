import { Injectable } from '@angular/core';

import { SessionStoragePort } from '@core/application/ports/auth/session-storage.port';
import { AuthenticatedSession } from '@core/domain/models/auth/authenticated-session.model';

interface StoredSession {
  token: string;
  expiresAtUtc: string;
  fullName: string;
  email: string;
}

@Injectable()
export class BrowserSessionStorageAdapter implements SessionStoragePort {
  private readonly storageKey = 'agileflow.session';

  save(session: AuthenticatedSession): void {
    const stored: StoredSession = {
      token: session.token,
      expiresAtUtc: session.expiresAtUtc.toISOString(),
      fullName: session.fullName,
      email: session.email
    };

    sessionStorage.setItem(this.storageKey, JSON.stringify(stored));
  }

  read(): AuthenticatedSession | null {
    const raw = sessionStorage.getItem(this.storageKey);

    if (!raw) {
      return null;
    }

    try {
      const stored = JSON.parse(raw) as StoredSession;

      return {
        token: stored.token,
        expiresAtUtc: new Date(stored.expiresAtUtc),
        fullName: stored.fullName,
        email: stored.email
      };
    } catch {
      this.clear();

      return null;
    }
  }

  clear(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}
