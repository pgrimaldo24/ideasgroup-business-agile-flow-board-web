export class ValidationMessages {
  static readonly fallback = 'El valor introducido no es válido';

  static readonly common: Record<string, string> = {
    required: 'Este campo es obligatorio',
    email: 'Introduce un correo electrónico válido',
    minlength: 'El valor es demasiado corto',
    maxlength: 'El valor supera la longitud permitida',
    min: 'El valor es menor que el mínimo permitido',
    max: 'El valor supera el máximo permitido',
    pattern: 'El formato introducido no es válido'
  };

  static resolve(errorKey: string, overrides: Record<string, string> = {}): string {
    return overrides[errorKey] ?? ValidationMessages.common[errorKey] ?? ValidationMessages.fallback;
  }
}
