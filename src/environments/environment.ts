import { AppConfig } from '../app/core/infrastructure/config/app-config.model';

export const environment: AppConfig = {
  production: true,
  apiBaseUrl: '/api',
  realtimeHubUrl: '/hubs'
};
