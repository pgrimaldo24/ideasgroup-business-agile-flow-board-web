import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { environment } from '@env/environment';
import { provideAppConfig } from '@core/infrastructure/config/app-config.token';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // `withComponentInputBinding` enlaza los parámetros de ruta (p. ej. :projectId)
    // directamente a los @Input del componente, evitando inyectar ActivatedRoute
    // y suscribirse manualmente dentro de las páginas.
    provideRouter(routes, withComponentInputBinding()),

    // `withFetch` usa la Fetch API en lugar de XMLHttpRequest.
    // Los interceptores (JWT y manejo de 401) se registran aquí al implementar
    // el módulo de autenticación.
    provideHttpClient(withFetch()),

    // Requerido por los componentes de PrimeNG que usan transiciones.
    provideAnimations(),

    provideAppConfig(environment)
  ]
};
