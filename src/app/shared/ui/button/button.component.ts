import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute
} from '@angular/core';
import { ButtonModule } from 'primeng/button';

export type ButtonVariant = 'primary' | 'secondary' | 'text';
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Botón reutilizable de la aplicación.
 *
 * Envuelve `p-button` de PrimeNG para que el resto del proyecto dependa de
 * esta API y no de la de la librería: si mañana se cambia PrimeNG por otra
 * cosa, solo se reescribe este archivo. Es el mismo principio de puertos y
 * adaptadores aplicado a la capa de presentación.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input({ required: true }) label = '';

  @Input() type: ButtonType = 'button';

  @Input() variant: ButtonVariant = 'primary';

  /** Clase de PrimeIcons, por ejemplo `pi pi-plus`. */
  @Input() icon = '';

  @Input({ transform: booleanAttribute }) disabled = false;

  /** Muestra el indicador de carga y bloquea la interacción. */
  @Input({ transform: booleanAttribute }) loading = false;

  /** Ocupa todo el ancho del contenedor. */
  @Input({ transform: booleanAttribute }) fullWidth = false;

  @Output() readonly clicked = new EventEmitter<MouseEvent>();

  protected get outlined(): boolean {
    return this.variant === 'secondary';
  }

  protected get textOnly(): boolean {
    return this.variant === 'text';
  }

  protected get styleClass(): string {
    return `app-button app-button--${this.variant}${this.fullWidth ? ' w-full' : ''}`;
  }
}
