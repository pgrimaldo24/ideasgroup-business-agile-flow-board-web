import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
  Self,
  booleanAttribute,
  inject
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { ValidationMessages } from '@shared/utils/validation-messages';

export type TextInputType = 'text' | 'email' | 'password';

let uniqueId = 0;

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [InputTextModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent implements ControlValueAccessor {
  private readonly changeDetector = inject(ChangeDetectorRef);

  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: TextInputType = 'text';
  @Input({ transform: booleanAttribute }) required = false;
  @Input() autocomplete = '';
  @Input() inputId = `app-text-input-${uniqueId++}`;
  @Input() errorMessages: Record<string, string> = {};

  @Output() readonly blurred = new EventEmitter<void>();
  @Output() readonly enterPressed = new EventEmitter<void>();

  protected value = '';
  protected disabled = false;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor(@Self() @Optional() private readonly ngControl: NgControl | null) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  protected get errorMessage(): string | null {
    const control = this.ngControl?.control;

    if (!control?.errors || !(control.touched || control.dirty)) {
      return null;
    }

    const [firstError] = Object.keys(control.errors);

    return ValidationMessages.resolve(firstError, this.errorMessages);
  }

  protected onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }

  protected onBlur(): void {
    this.onTouched();
    this.changeDetector.markForCheck();
    this.blurred.emit();
  }

  protected onEnter(): void {
    this.enterPressed.emit();
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
