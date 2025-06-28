import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginLog } from './login-history.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginHistory {
  private baseUrl = 'https://user-m-service.onrender.com/login-logs';

  constructor(private http: HttpClient) {}

  getMyLogs(): Observable<LoginLog[]> {
    return this.http.get<LoginLog[]>(`${this.baseUrl}/my/monthly`);
  }

  getAllLogs(): Observable<LoginLog[]> {
    return this.http.get<LoginLog[]>(`${this.baseUrl}/all/monthly`);
  }
}
