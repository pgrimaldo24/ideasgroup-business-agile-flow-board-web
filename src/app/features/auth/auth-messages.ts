import { AuthenticationErrorCode } from '@core/domain/models/auth/authentication-error.model';

export class AuthMessages {
  static readonly email: Record<string, string> = {
    required: 'El correo electrónico es obligatorio'
  };

  static readonly password: Record<string, string> = {
    required: 'La contraseña es obligatoria'
  };

  static readonly authenticationError: Record<AuthenticationErrorCode, string> = {
    'invalid-credentials': 'El correo electrónico o la contraseña no son correctos',
    unreachable: 'No se pudo conectar con el servidor. Inténtalo de nuevo',
    unknown: 'Ocurrió un error inesperado al iniciar sesión'
  };
}
