import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { LoginDto, AuthResponse } from './auth.models';

import { HttpService } from '../http/http.service';

interface LoginResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpService);
  private readonly TOKEN_KEY = 'app_token';
  private readonly USER_KEY = 'app_user';
  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  login(dto: LoginDto): Observable<void> {
    return this.http.postText('login', dto).pipe(
      tap((raw) => {
        const token = raw?.toString();

        this.setToken(token);
        this._isLoggedIn$.next(true);
      }),
      map(() => void 0)
    );
  }

  logout(): void {
    this.clearToken();
    this._isLoggedIn$.next(false);
    // Optionally call a logout endpoint if your API needs it.
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
