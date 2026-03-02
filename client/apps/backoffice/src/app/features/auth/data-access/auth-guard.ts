import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from './session-service';

export const authGuard: CanActivateFn = (route, state) => {
    const sessionService = inject(SessionService);
    const router = inject(Router);

    return sessionService.isAuthenticated()
        ? true
        : router.createUrlTree(['/admin/auth/login'], {
              queryParams: { returnUrl: state.url },
          });
};
