import { InjectionToken, Provider } from '@angular/core';

import { AppConfig } from './app-config.model';

/**
 * Token de inyección de la configuración externa.
 *
 * Se inyecta en los adaptadores de infraestructura para resolver las URLs. Al
 * ser un token y no un import directo del archivo de entorno, las pruebas
 * pueden proveer una configuración distinta sin tocar el bundle.
 */
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

/** Registra la configuración externa en el inyector raíz. */
export function provideAppConfig(config: AppConfig): Provider {
  return { provide: APP_CONFIG, useValue: config };
}
