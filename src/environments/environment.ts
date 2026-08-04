import { AppConfig } from '../app/core/infrastructure/config/app-config.model';

/**
 * Configuración de producción.
 *
 * Las URLs son relativas a propósito: en el despliegue con Docker, nginx sirve
 * la SPA y hace proxy de `/api` y `/hubs` hacia el backend. Así el bundle no
 * queda atado a ningún host y la misma imagen sirve para cualquier entorno.
 */
export const environment: AppConfig = {
  production: true,
  apiBaseUrl: '/api',
  realtimeHubUrl: '/hubs'
};
