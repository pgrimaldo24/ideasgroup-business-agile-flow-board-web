import { ChangeDetectorRef, Component, Input, Optional, Self, booleanAttribute, inject } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

export type TextInputType = 'text' | 'email' | 'password';

/** Contador para generar identificadores únicos cuando no se proporciona uno. */
let uniqueId = 0;

/**
 * Campo de texto reutilizable.
 *
 * Envuelve la directiva `pInputText` de PrimeNG e implementa
 * `ControlValueAccessor`, de modo que se integra con formularios reactivos
 * mediante `formControlName` como cualquier control nativo.
 *
 * El accesor se registra inyectando `NgControl` con `@Self()` en lugar de
 * declarar `NG_VALUE_ACCESSOR`: así se evita la dependencia circular y el
 * componente conserva acceso al control para leer su estado de validación.
 *
 * Usa detección de cambios por defecto de forma deliberada. Con `OnPush`, las
 * transiciones de estado que no emiten eventos —`markAllAsTouched()` al enviar
 * el formulario— no repintarían el mensaje de error.
 */
@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [InputTextModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent implements ControlValueAccessor {
  private readonly changeDetector = inject(ChangeDetectorRef);

  /** Etiqueta visible sobre el campo. */
  @Input({ required: true }) label = '';

  /** Texto de ayuda dentro del campo mientras está vacío. */
  @Input() placeholder = '';

  @Input() type: TextInputType = 'text';

  /** Marca el campo con asterisco y lo anuncia a los lectores de pantalla. */
  @Input({ transform: booleanAttribute }) required = false;

  /** Valor del atributo `autocomplete` del navegador. */
  @Input() autocomplete = '';

  /** Identificador del input; enlaza la etiqueta con el campo. */
  @Input() inputId = `app-text-input-${uniqueId++}`;

  /**
   * Mensajes por clave de error del validador.
   * Ejemplo: `{ required: 'El correo es obligatorio' }`
   */
  @Input() errorMessages: Record<string, string> = {};

  protected value = '';
  protected disabled = false;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor(@Self() @Optional() private readonly ngControl: NgControl | null) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /** Mensaje a mostrar, o `null` si el campo aún no debe reportar error. */
  protected get errorMessage(): string | null {
    const control = this.ngControl?.control;

    if (!control?.errors || !(control.touched || control.dirty)) {
      return null;
    }

    const [firstError] = Object.keys(control.errors);

    return this.errorMessages[firstError] ?? 'El valor introducido no es válido';
  }

  protected onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }

  protected onBlur(): void {
    this.onTouched();
    this.changeDetector.markForCheck();
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
