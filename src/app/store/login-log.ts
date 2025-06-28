import { Injectable, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LoginHistory } from '../services/login-history';
import { LoginLog } from '../services/login-history.interface';

@Injectable({ providedIn: 'root' })
export class LoginHistoryStore {
  private myLogsSignal = signal<LoginLog[]>([]);
  private allLogsSignal = signal<LoginLog[]>([]);
  private loadingSignal = signal(false);

  /** Signals สำหรับใช้ใน Template */
  myLogs = computed(() => this.myLogsSignal());
  allLogs = computed(() => this.allLogsSignal());
  loading = computed(() => this.loadingSignal());

  constructor(private loginHistory: LoginHistory) {}

  async fetchMyLogs(): Promise<void> {
    this.loadingSignal.set(true);
    this.myLogsSignal.set([]);
    try {
      const logs = await firstValueFrom(this.loginHistory.getMyLogs());
      this.myLogsSignal.set(logs);
    } catch (error) {
      console.error('❌ Failed to fetch my logs:', error);
      this.myLogsSignal.set([]);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async fetchAllLogs(): Promise<void> {
    this.loadingSignal.set(true);
    this.allLogsSignal.set([]);
    try {
      const logs = await firstValueFrom(this.loginHistory.getAllLogs());
      this.allLogsSignal.set(logs);
    } catch (error) {
      console.error('❌ Failed to fetch all logs:', error);
      this.allLogsSignal.set([]);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  clear(): void {
    this.myLogsSignal.set([]);
    this.allLogsSignal.set([]);
  }
}
