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
  @Input() icon = '';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) loading = false;
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
