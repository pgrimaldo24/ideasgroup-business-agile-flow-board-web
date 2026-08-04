import { APP_INITIALIZER, Provider, inject } from '@angular/core';
import { Router } from '@angular/router';

import { SessionStore } from '@core/application/state/auth/session.store';

export function provideSessionExpiryRedirect(): Provider {
  return {
    provide: APP_INITIALIZER,
    multi: true,
    useFactory: () => {
      const session = inject(SessionStore);
      const router = inject(Router);

      return () => {
        session.expired$.subscribe(() => {
          void router.navigate(['/auth/login']);
        });
      };
    }
  };
}
