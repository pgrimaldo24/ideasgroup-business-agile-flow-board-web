import { ChangeDetectorRef, Component, Input, Optional, Self, booleanAttribute, inject } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

import { ValidationMessages } from '@shared/utils/validation-messages';

import { SelectOption } from './select-option.model';

let uniqueId = 0;

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [FormsModule, DropdownModule],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss'
})
export class SelectInputComponent<TValue = string> implements ControlValueAccessor {
  private readonly changeDetector = inject(ChangeDetectorRef);

  @Input() label = '';
  @Input() placeholder = 'Selecciona una opción';
  @Input({ required: true }) options: readonly SelectOption<TValue>[] = [];
  @Input({ transform: booleanAttribute }) required = false;
  @Input() inputId = `app-select-input-${uniqueId++}`;
  @Input() errorMessages: Record<string, string> = {};

  protected value: TValue | null = null;
  protected disabled = false;

  private onChange: (value: TValue) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor(@Self() @Optional() private readonly ngControl: NgControl | null) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  protected get dropdownOptions(): SelectOption<TValue>[] {
    return this.options as SelectOption<TValue>[];
  }

  protected get errorMessage(): string | null {
    const control = this.ngControl?.control;

    if (!control?.errors || !(control.touched || control.dirty)) {
      return null;
    }

    const [firstError] = Object.keys(control.errors);

    return ValidationMessages.resolve(firstError, this.errorMessages);
  }

  protected onSelectionChange(value: TValue): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  protected onBlur(): void {
    this.onTouched();
    this.changeDetector.markForCheck();
  }

  writeValue(value: TValue | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: TValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
