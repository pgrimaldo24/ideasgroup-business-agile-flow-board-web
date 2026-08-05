import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { SessionStore } from '@core/application/state/auth/session.store';
import { LogoutUseCase } from '@core/application/use-cases/auth/logout.use-case';
import { AvatarComponent } from '@shared/ui/avatar/avatar.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { TextInputComponent } from '@shared/ui/text-input/text-input.component';
import { LayoutService } from '@layout/layout.service';
import { PageToolbarService } from '@layout/page-toolbar.service';

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
  private readonly toolbar = inject(PageToolbarService);

  protected readonly search = new FormControl('', { nonNullable: true });

  protected readonly userName = computed(() => this.session.current()?.fullName ?? '');
  protected readonly handlers = this.toolbar.handlers;

  protected readonly searchPlaceholder = computed(
    () => this.handlers()?.searchPlaceholder ?? 'Buscar'
  );

  protected readonly createLabel = computed(() => this.handlers()?.createLabel ?? 'Crear');

  protected readonly createDisabled = computed(() => this.handlers()?.createDisabled?.() ?? false);

  constructor() {
    this.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.handlers()?.onSearch(term));

    effect(() => {
      this.handlers();
      this.search.setValue('', { emitEvent: false });
    });
  }

  protected toggleSidebar(): void {
    this.layout.toggleSidebar();
  }

  protected create(): void {
    this.handlers()?.onCreate();
  }

  protected logout(): void {
    this.logoutUseCase.execute();
    void this.router.navigate(['/auth/login']);
  }
}
