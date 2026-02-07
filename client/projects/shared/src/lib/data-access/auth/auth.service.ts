import { HttpClient } from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {Observable, tap} from 'rxjs';
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from './types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080';

  private _user = signal<any | null>(null);
  readonly user = this._user.asReadonly();

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`${this.baseUrl}/auth/login`, payload).pipe(
      tap(res => this.saveToken(res.data.token))
    );
  }

  register(payload: RegisterPayload): Observable<RegisterResponse> {
    return this._http.post<RegisterResponse>(`${this.baseUrl}/auth/register`, payload);
  }

  logout() {
    localStorage.removeItem('auth_token');
    this._user.set(null);
  }

  private saveToken(token: string) {
    localStorage.setItem('auth_token', token);
    this._user.set(token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasPermission(permission: string): boolean {
    return true;
  }
}
