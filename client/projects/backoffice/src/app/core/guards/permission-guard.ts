import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from 'shared';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  const requiredPermission = route.data['permissions'] as string;
  if (!requiredPermission || authService.hasPermission(requiredPermission)) {
    return true;
  }

  return router.createUrlTree(['/admin/unauthorized']);
};
