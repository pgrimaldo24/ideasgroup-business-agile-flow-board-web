import { InjectionToken, Provider } from '@angular/core';

import { AppConfig } from './app-config.model';

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

export function provideAppConfig(config: AppConfig): Provider {
  return { provide: APP_CONFIG, useValue: config };
}
