// ✅ auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginPayload, RegisterPayload, UserProfile } from './auth.interface';
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
  private baseUrl = 'https://user-m-service.onrender.com/users';

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<{ access_token: string }> {
    return this.http
      .post<{ access_token: string }>(`${this.baseUrl}/login`, payload)
      .pipe(
        tap((res) => {
          if (res?.access_token) {
            setAccessToken(res.access_token);
          }
        })
      );
  }

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  createAdmin(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-admin`, payload);
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/profile`);
  }
}
