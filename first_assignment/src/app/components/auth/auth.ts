import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SimpleUser } from './user';
import { HttpClient } from '@angular/common/http';

interface LoginResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private baseUrl = 'https://assignment1.swafe.dk/';
  private readonly TOKEN_KEY = 'app_token';
  private readonly USER_KEY = 'app_user';
  private userSubject = new BehaviorSubject<SimpleUser | null>(null);
  user$ = this.userSubject.asObservable();
  private loggedIn = true;

  constructor(private http: HttpClient) {
    this.retrieveCookies();
  }

  private retrieveCookies() {
    const rawUser = sessionStorage.getItem(this.USER_KEY);
    const token = sessionStorage.getItem(this.TOKEN_KEY);
    if (rawUser && token) {
      try {
        const user: SimpleUser = JSON.parse(rawUser);
        this.userSubject.next(user);
      } catch {
        this.clearSession();
      }
    }
  }

  private clearSession() {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
  }
  public isLoggedIn() {
    return this.loggedIn;
  }

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/api/Login`, credentials)
      .pipe(tap((res) => this.setSession(res.username, res.token)));
  }

  private setSession(username: string, token: string) {
    const user: SimpleUser = { username };
    sessionStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);
  }
}
