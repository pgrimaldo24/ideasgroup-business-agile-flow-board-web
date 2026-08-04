import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';

import {
  SESSION_STORAGE_PORT,
  SessionStoragePort
} from '@core/application/ports/auth/session-storage.port';
import { AuthenticatedSession } from '@core/domain/models/auth/authenticated-session.model';

import { authGuard } from './auth.guard';

class StubSessionStorage implements SessionStoragePort {
  constructor(private session: AuthenticatedSession | null) {}

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

function configureWith(session: AuthenticatedSession | null): void {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: SESSION_STORAGE_PORT, useValue: new StubSessionStorage(session) }
    ]
  });
}

function runGuard(): boolean | UrlTree {
  return TestBed.runInInjectionContext(() =>
    authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
  ) as boolean | UrlTree;
}

describe('authGuard', () => {
  it('permite el acceso con una sesión vigente', () => {
    configureWith({
      token: 'jwt-token',
      expiresAtUtc: new Date(Date.now() + 60_000),
      fullName: 'Ana Torres',
      email: 'ana@ideasgroup.com.ec'
    });

    expect(runGuard()).toBeTrue();
  });

  it('redirige al login sin sesión', () => {
    configureWith(null);

    const result = runGuard();

    expect(result instanceof UrlTree).toBeTrue();
    expect((result as UrlTree).toString()).toBe('/auth/login');
  });

  it('redirige al login con una sesión expirada', () => {
    configureWith({
      token: 'jwt-token',
      expiresAtUtc: new Date(Date.now() - 1_000),
      fullName: 'Ana Torres',
      email: 'ana@ideasgroup.com.ec'
    });

    const result = runGuard();

    expect(result instanceof UrlTree).toBeTrue();
    expect((result as UrlTree).toString()).toBe('/auth/login');
  });
});
