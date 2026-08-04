import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import {
  SESSION_STORAGE_PORT,
  SessionStoragePort
} from '@core/application/ports/auth/session-storage.port';
import { AuthenticatedSession } from '@core/domain/models/auth/authenticated-session.model';

import { SessionStore } from './session.store';

class InMemorySessionStorage implements SessionStoragePort {
  private session: AuthenticatedSession | null = null;

  save(session: AuthenticatedSession): void {
    this.session = session;
  }

  read(): AuthenticatedSession | null {
    return this.session;
  }

  clear(): void {
    this.session = null;
  }
}

function sessionExpiringIn(milliseconds: number): AuthenticatedSession {
  return {
    token: 'jwt-token',
    expiresAtUtc: new Date(Date.now() + milliseconds),
    fullName: 'Ana Torres',
    email: 'ana@ideasgroup.com.ec'
  };
}

describe('SessionStore', () => {
  let storage: InMemorySessionStorage;

  beforeEach(() => {
    storage = new InMemorySessionStorage();

    TestBed.configureTestingModule({
      providers: [{ provide: SESSION_STORAGE_PORT, useValue: storage }]
    });
  });

  it('restaura una sesión vigente al arrancar', () => {
    storage.save(sessionExpiringIn(60_000));

    const store = TestBed.inject(SessionStore);

    expect(store.isAuthenticated()).toBeTrue();
    expect(store.token()).toBe('jwt-token');
  });

  it('descarta una sesión ya expirada al arrancar', () => {
    storage.save(sessionExpiringIn(-1_000));

    const store = TestBed.inject(SessionStore);

    expect(store.isAuthenticated()).toBeFalse();
    expect(storage.read()).toBeNull();
  });

  it('cierra la sesión y avisa cuando el token expira', fakeAsync(() => {
    const store = TestBed.inject(SessionStore);
    let notified = false;

    store.expired$.subscribe(() => {
      notified = true;
    });

    store.start(sessionExpiringIn(5_000));

    expect(store.isAuthenticated()).toBeTrue();

    tick(5_000);

    expect(store.isAuthenticated()).toBeFalse();
    expect(notified).toBeTrue();
    expect(storage.read()).toBeNull();
  }));
});
