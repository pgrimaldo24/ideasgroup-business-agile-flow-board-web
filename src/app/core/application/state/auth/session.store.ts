import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { SESSION_STORAGE_PORT } from '@core/application/ports/auth/session-storage.port';
import { AuthenticatedSession } from '@core/domain/models/auth/authenticated-session.model';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private static readonly maxTimeoutDelay = 2_147_483_647;

  private readonly storage = inject(SESSION_STORAGE_PORT);
  private readonly expiredSubject = new Subject<void>();
  private readonly session = signal<AuthenticatedSession | null>(null);

  private expiryTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly current = this.session.asReadonly();
  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly expired$: Observable<void> = this.expiredSubject.asObservable();

  constructor() {
    this.restore();
  }

  start(session: AuthenticatedSession): void {
    this.storage.save(session);
    this.session.set(session);
    this.scheduleExpiry(session);
  }

  clear(): void {
    this.cancelExpiry();
    this.storage.clear();
    this.session.set(null);
  }

  token(): string | null {
    return this.session()?.token ?? null;
  }

  private restore(): void {
    const stored = this.storage.read();

    if (!stored) {
      return;
    }

    if (this.hasExpired(stored)) {
      this.storage.clear();

      return;
    }

    this.session.set(stored);
    this.scheduleExpiry(stored);
  }

  private scheduleExpiry(session: AuthenticatedSession): void {
    this.cancelExpiry();

    if (this.hasExpired(session)) {
      this.expire();

      return;
    }

    const remaining = session.expiresAtUtc.getTime() - Date.now();
    const delay = Math.min(remaining, SessionStore.maxTimeoutDelay);

    this.expiryTimeout = setTimeout(() => this.scheduleExpiry(session), delay);
  }

  private expire(): void {
    this.clear();
    this.expiredSubject.next();
  }

  private cancelExpiry(): void {
    if (this.expiryTimeout === null) {
      return;
    }

    clearTimeout(this.expiryTimeout);
    this.expiryTimeout = null;
  }

  private hasExpired(session: AuthenticatedSession): boolean {
    return session.expiresAtUtc.getTime() <= Date.now();
  }
}
