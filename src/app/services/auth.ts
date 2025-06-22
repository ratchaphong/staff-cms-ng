import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isBrowser } from '../utils/browser.utils'; // 👈 นำเข้า
import { LoginPayload, RegisterPayload } from './auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://user-m-service.onrender.com/users';
  private readonly TOKEN_KEY = 'access_token';

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<{ access_token: string }> {
    return this.http
      .post<{ access_token: string }>(`${this.baseUrl}/login`, payload)
      .pipe(
        tap((res) => {
          if (isBrowser() && res?.access_token) {
            localStorage.setItem(this.TOKEN_KEY, res.access_token);
            localStorage.setItem('token_time', `${Date.now()}`);
          }
        })
      );
  }

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  getProfile(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/profile`, { headers });
  }

  getToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getTokenTime(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem('token_time');
  }

  clearToken() {
    if (isBrowser()) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem('token_time');
    }
  }

  isLoggedIn(): boolean {
    if (!isBrowser()) return false;

    const token = this.getToken();
    const tokenTime = localStorage.getItem('token_time');
    if (!token || !tokenTime) return false;

    const now = Date.now();
    const diff = now - parseInt(tokenTime, 10);
    const oneHour = 60 * 60 * 1000;

    if (diff > oneHour) {
      this.clearToken();
      return false;
    }

    return true;
  }
}
