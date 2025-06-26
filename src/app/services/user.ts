// ✅ user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { User, UserQuery } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'https://user-m-service.onrender.com/users';

  constructor(private http: HttpClient) {}

  getUsers(query: UserQuery): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.baseUrl}/search`, {
        params: this.objectToParams(query),
      })
      .pipe(catchError(this.handleError));
  }

  updateUserProfile(userId: string, updated: Partial<User>): Observable<User> {
    return this.http
      .patch<User>(`${this.baseUrl}/${userId}/profile`, updated)
      .pipe(catchError(this.handleError));
  }

  updateUserRole(
    userId: string,
    role: 'USER' | 'STAFF' | 'ADMIN'
  ): Observable<void> {
    return this.http
      .patch<void>(`${this.baseUrl}/${userId}/role`, { role })
      .pipe(catchError(this.handleError));
  }

  deleteUser(userId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${userId}`)
      .pipe(catchError(this.handleError));
  }

  private objectToParams(query: Record<string, any>): any {
    const params: Record<string, string> = {};
    for (const key in query) {
      if (
        query[key] !== undefined &&
        query[key] !== null &&
        query[key] !== ''
      ) {
        params[key] = query[key].toString();
      }
    }
    return params;
  }

  private handleError(err: any) {
    console.error('❌ user.service.ts error:', err);
    return throwError(() => err);
  }
}
