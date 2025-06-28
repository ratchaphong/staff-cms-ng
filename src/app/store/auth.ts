import { Injectable, computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth';
import {
  UserProfile,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
} from '../services/auth.interface';
import {
  isBrowser,
  getAccessToken,
  getTokenTime,
  clearToken,
} from '../utils/helpers';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private profileSignal = signal<UserProfile | null>(null);
  private loadingSignal = signal(false);

  profile = computed(() => this.profileSignal());
  loading = computed(() => this.loadingSignal());

  constructor(private authService: AuthService) {}

  setProfile(profile: UserProfile) {
    this.profileSignal.set(profile);
  }

  clearProfile() {
    this.profileSignal.set(null);
  }

  isLoggedIn(): boolean {
    if (!isBrowser()) return false;
    const token = getAccessToken();
    const tokenTime = getTokenTime();
    if (!token || !tokenTime) return false;

    const now = Date.now();
    const diff = now - parseInt(tokenTime, 10);
    const oneHour = 60 * 60 * 1000;

    const remainingMs = oneHour - diff;
    const remainingMin = Math.floor(remainingMs / 1000 / 60);
    const remainingSec = Math.floor((remainingMs / 1000) % 60);
    console.log(`🕒 Session remaining: ${remainingMin}m ${remainingSec}s`);

    if (diff > oneHour) {
      this.logout();
      clearToken();
      return false;
    }
    return true;
  }

  async login(payload: LoginPayload): Promise<void> {
    this.loadingSignal.set(true);
    try {
      await firstValueFrom(this.authService.login(payload));
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async register(payload: RegisterPayload): Promise<void> {
    this.loadingSignal.set(true);
    try {
      await firstValueFrom(this.authService.register(payload));
    } catch (error) {
      console.error('❌ Register failed:', error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async createAdmin(payload: RegisterPayload): Promise<void> {
    this.loadingSignal.set(true);
    try {
      await firstValueFrom(this.authService.createAdmin(payload));
    } catch (error) {
      console.error('❌ Create admin failed:', error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async fetchProfile(): Promise<void> {
    this.loadingSignal.set(true);
    this.clearProfile();
    try {
      // const profile = await this.authService.getProfile().toPromise();
      const profile = await firstValueFrom(this.authService.getProfile());
      if (profile) {
        this.setProfile(profile);
      }
    } catch (error) {
      console.error('❌ Failed to fetch profile:', error);
      this.clearProfile();
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<void> {
    this.loadingSignal.set(true);
    try {
      await firstValueFrom(this.authService.updateProfile(payload));
    } catch (error) {
      console.error('❌ Update profile failed:', error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async logout(): Promise<void> {
    this.loadingSignal.set(true);
    try {
      await firstValueFrom(this.authService.logout());
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }
}
