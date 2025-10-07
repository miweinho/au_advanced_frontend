import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceTs {
  private readonly BASE_URL = 'http://localhost:3000'; // ou o que usares

  constructor(private http: HttpClient) {}

  postText(endpoint: string, data: any): Observable<string> {
    return this.http.post(`${this.BASE_URL}/${endpoint}`, data, { responseType: 'text' });
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.BASE_URL}/${endpoint}`);
  }
}
