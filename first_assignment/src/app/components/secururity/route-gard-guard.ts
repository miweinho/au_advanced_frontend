import { CanActivateFn, RedirectCommand } from '@angular/router';
import { Auth } from '../auth/auth';
import {inject } from '@angular/core'
import { Router } from '@angular/router';


export const routeGardGuard: CanActivateFn = (route, state) => {
  let authService = inject(Auth);
  const router = inject(Router);

  if(!authService.isLoggedIn()) {
    const loginPath = router.parseUrl("/login");
    return new RedirectCommand(loginPath, {
      skipLocationChange: true,
    });
  }
  return true;
};
