import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SessionStore } from '@core/application/state/auth/session.store';
import { LogoutUseCase } from '@core/application/use-cases/auth/logout.use-case';
import { AvatarComponent } from '@shared/ui/avatar/avatar.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { TextInputComponent } from '@shared/ui/text-input/text-input.component';
import { LayoutService } from '@layout/layout.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [ReactiveFormsModule, AvatarComponent, ButtonComponent, TextInputComponent],
  templateUrl: './app-topbar.component.html',
  styleUrl: './app-topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppTopbarComponent {
  private readonly layout = inject(LayoutService);
  private readonly session = inject(SessionStore);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly router = inject(Router);

  protected readonly search = new FormControl('', { nonNullable: true });

  protected readonly userName = computed(() => this.session.current()?.fullName ?? '');

  protected toggleSidebar(): void {
    this.layout.toggleSidebar();
  }

  protected logout(): void {
    this.logoutUseCase.execute();
    void this.router.navigate(['/auth/login']);
  }
}
