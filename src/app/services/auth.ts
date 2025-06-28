// ✅ auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  UserProfile,
} from './auth.interface';
import {
  clearToken,
  getAccessToken,
  getTokenTime,
  isBrowser,
  setAccessToken,
} from '../utils/helpers';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://user-m-service.onrender.com';

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<{ access_token: string }> {
    return this.http
      .post<{ access_token: string }>(`${this.baseUrl}/users/login`, payload)
      .pipe(
        tap((res) => {
          if (res?.access_token) {
            setAccessToken(res.access_token);
          }
        })
      );
  }

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/register`, payload);
  }

  createAdmin(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/create-admin`, payload);
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/users/profile`);
  }

  updateProfile(updated: UpdateProfilePayload): Observable<any> {
    return this.http.patch(`${this.baseUrl}/login-logs/logout`, updated);
  }

  logout(): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/login-logs/logout`, {});
  }
}
