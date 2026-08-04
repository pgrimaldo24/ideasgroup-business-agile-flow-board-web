import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';

import { ButtonComponent } from '@shared/ui/button/button.component';
import { TextInputComponent } from '@shared/ui/text-input/text-input.component';

/**
 * Pantalla de inicio de sesión.
 *
 * Solo declara el formulario y delega el envío. La autenticación en sí
 * (petición, emisión y persistencia del token) vive en el caso de uso
 * correspondiente de `core/application/use-cases`.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CheckboxModule, TooltipModule, ButtonComponent, TextInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);

  protected readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  protected readonly emailErrors: Record<string, string> = {
    required: 'El correo electrónico es obligatorio',
    email: 'Introduce un correo electrónico válido'
  };

  protected readonly passwordErrors: Record<string, string> = {
    required: 'La contraseña es obligatoria'
  };

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // TODO(auth): invocar LoginUseCase cuando el endpoint del backend exista.
  }
}
