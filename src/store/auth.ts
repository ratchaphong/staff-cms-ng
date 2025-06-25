import { Injectable, computed, signal } from '@angular/core';
import { AuthService } from '../app/services/auth';
import {
  LoginPayload,
  RegisterPayload,
  UserProfile,
} from '../app/services/auth.interface';
import { firstValueFrom } from 'rxjs';

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
}
