import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServicee } from '../services/services/auth.servicee';

export const authGuard: CanActivateFn = (route, state) => {
  const _Router=inject(Router);
  const _AuthService=inject(AuthServicee);
  if (_AuthService.isLoggedIn()) {
    return true;
  } else {
    _Router.navigate(['login']);
    return false;
  }
};
