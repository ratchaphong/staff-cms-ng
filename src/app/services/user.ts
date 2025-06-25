// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { UserQuery, User } from './user.interface';
import { isBrowser } from '../utils/helpers'; // ถ้ามีตัวช่วยแยกฝั่ง browser

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'https://user-m-service.onrender.com/users'; // ✅ ใช้ endpoint ที่ถูกต้อง

  constructor(private http: HttpClient) {}

  getUsers(query: UserQuery): Observable<User[]> {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, val.toString());
      }
    });

    const token = isBrowser() ? localStorage.getItem('access_token') : null;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
    });

    return this.http
      .get<User[]>(this.baseUrl + '/search', { params, headers })
      .pipe(
        catchError((err) => {
          console.error('❌ API error', err);
          throw err;
        })
      );
  }

  updateUserProfile(userId: string, updated: Partial<User>): Observable<User> {
    const token = isBrowser() ? localStorage.getItem('access_token') : null;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .patch<User>(this.baseUrl + `/${userId}/profile`, updated, { headers })
      .pipe(
        catchError((err) => {
          console.error('❌ Error updating user', err);
          throw err;
        })
      );
  }

  updateUserRole(
    userId: string,
    role: 'USER' | 'STAFF' | 'ADMIN'
  ): Observable<void> {
    const token = isBrowser() ? localStorage.getItem('access_token') : null;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .patch<void>(this.baseUrl + `/${userId}/role`, { role }, { headers })
      .pipe(
        catchError((err) => {
          console.error('❌ Error updating user role', err);
          throw err;
        })
      );
  }

  deleteUser(userId: string): Observable<void> {
    const token = isBrowser() ? localStorage.getItem('access_token') : null;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
    });

    return this.http
      .delete<void>(this.baseUrl + `/${userId}`, {
        headers,
      })
      .pipe(
        catchError((err) => {
          console.error('❌ Delete error', err);
          throw err;
        })
      );
  }
}
