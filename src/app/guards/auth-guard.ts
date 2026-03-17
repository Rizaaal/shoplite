import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const user = inject(AuthService);
  const router = inject(Router);

  if (user.isLogged()) {
    return true;
  } else {
    router.navigate(['/sign-in']);
    return false;
  }
};
