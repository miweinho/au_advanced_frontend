import { CanActivateFn, RedirectCommand } from '@angular/router';
import { Auth } from '../auth/auth';
import {inject } from '@angular/core'
import { Router } from '@angular/router';
import { map } from 'rxjs';


export const routeGuard: CanActivateFn = (route, state) => {
  let authService = inject(Auth);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map((loggedIn) => (loggedIn ? true: router.parseUrl('/login')))
  )
};
