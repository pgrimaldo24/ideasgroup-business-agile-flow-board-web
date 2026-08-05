import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { AUTH_PORT } from '@core/application/ports/auth/auth.port';
import { SESSION_STORAGE_PORT } from '@core/application/ports/auth/session-storage.port';
import { TASK_REPOSITORY_PORT } from '@core/application/ports/board/task-repository.port';
import { provideSessionExpiryRedirect } from '@core/infrastructure/auth/session-expiry.provider';
import { provideAppConfig } from '@core/infrastructure/config/app-config.token';
import { authInterceptor } from '@core/infrastructure/interceptors/auth.interceptor';
import { AuthHttpAdapter } from '@core/infrastructure/http/auth/auth-http.adapter';
import { TaskHttpAdapter } from '@core/infrastructure/http/board/task-http.adapter';
import { BrowserSessionStorageAdapter } from '@core/infrastructure/storage/browser-session-storage.adapter';
import { environment } from '@env/environment';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimations(),
    provideAppConfig(environment),
    { provide: AUTH_PORT, useClass: AuthHttpAdapter },
    { provide: SESSION_STORAGE_PORT, useClass: BrowserSessionStorageAdapter },
    { provide: TASK_REPOSITORY_PORT, useClass: TaskHttpAdapter },
    provideSessionExpiryRedirect()
  ]
};
