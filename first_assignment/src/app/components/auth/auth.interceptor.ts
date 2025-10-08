import { HttpRequest, HttpHandlerFn } from "@angular/common/http";
import { inject } from '@angular/core';
import { Auth } from "./auth";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(Auth).getToken();
  // Clone the request to add the authentication header.

  const newReq = authToken ? req.clone({
    headers: req.headers.append('Authorization', `Bearer ${authToken}`),
  }) : req;

  return next(newReq);
}
