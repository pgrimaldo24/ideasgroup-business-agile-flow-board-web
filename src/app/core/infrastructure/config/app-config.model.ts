/**
 * Configuración externa de la aplicación.
 *
 * Es el único punto donde viven las direcciones de servicio. Ningún componente
 * ni caso de uso construye URLs a mano: los adaptadores las reciben desde el
 * token `APP_CONFIG`.
 */
export interface AppConfig {
  /** Indica si el bundle se compiló para producción. */
  readonly production: boolean;

  /** URL base de la API RESTful, sin barra final. */
  readonly apiBaseUrl: string;

  /** URL del hub de tiempo real, sin barra final. */
  readonly realtimeHubUrl: string;
}
