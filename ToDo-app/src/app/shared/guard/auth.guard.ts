import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _Router=inject(Router);
  const _AuthService=inject(AuthService);
  if (_AuthService.isLoggedIn()) {
    return true;
  } else {
    _Router.navigate(['login']);
    return false;
  }
};
