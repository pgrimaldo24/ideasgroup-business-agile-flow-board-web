import { AppConfig } from '../app/core/infrastructure/config/app-config.model';

/**
 * Configuración de desarrollo local, sustituye a `environment.ts` mediante
 * `fileReplacements` en la configuración `development` de angular.json.
 */
export const environment: AppConfig = {
  production: false,
  apiBaseUrl: 'http://localhost:5000/api',
  realtimeHubUrl: 'http://localhost:5000/hubs'
};
