import { AppConfig } from '../app/core/infrastructure/config/app-config.model';

export const environment: AppConfig = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api',
  realtimeHubUrl: 'http://localhost:8080/hubs'
};
