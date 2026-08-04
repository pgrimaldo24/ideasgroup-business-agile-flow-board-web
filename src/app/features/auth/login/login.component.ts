import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginUseCase } from '@core/application/use-cases/auth/login.use-case';
import { AuthenticationError } from '@core/domain/models/auth/authentication-error.model';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { TextInputComponent } from '@shared/ui/text-input/text-input.component';

import { AuthMessages } from '../auth-messages';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, TextInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly emailErrors = AuthMessages.email;
  protected readonly passwordErrors = AuthMessages.password;

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.loginUseCase
      .execute(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          void this.router.navigate(['/projects']);
        },
        error: (error: unknown) => {
          this.submitting.set(false);
          this.errorMessage.set(this.resolveErrorMessage(error));
        }
      });
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof AuthenticationError) {
      return AuthMessages.authenticationError[error.code];
    }

    return AuthMessages.authenticationError.unknown;
  }
}
