// ✅ user.store.ts
import { Injectable, computed, effect, signal } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from '../services/auth';
import { UserService } from '../services/user';
import { User, UserQuery } from '../services/user.interface';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private usersSignal = signal<User[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal('');
  private profileSignal = signal<User | null>(null);

  users = computed(() => this.usersSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());
  profile = computed(() => this.profileSignal());

  filteredUsers = computed(() => {
    const users = this.usersSignal();
    const profile = this.profileSignal();

    // console.log('🧪 profile:', profile);
    // console.log('🧪 users:', users);
    return profile ? users.filter((u) => u.id !== profile.id) : users;
  });

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    // effect(() => {
    //   const profile = this.profileSignal();
    //   const users = this.usersSignal();
    //   console.log('🟡 Effect: profile or users changed');
    //   console.log('🧪 profile:', profile);
    //   console.log('🧪 users:', users);
    // });
  }

  fetchProfile(): void {
    this.loadingSignal.set(true);
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profileSignal.set(profile);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set('ไม่สามารถโหลดโปรไฟล์ผู้ใช้ได้');
        this.loadingSignal.set(false);
        console.error('❌ fetchProfile error:', err);
      },
    });
  }

  fetchProfileAndUsers(query: UserQuery): void {
    this.loadingSignal.set(true);
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profileSignal.set(profile);
        this.fetchUsers(query);
      },
      error: (err) => {
        this.errorSignal.set('ไม่สามารถโหลดโปรไฟล์ผู้ใช้ได้');
        this.loadingSignal.set(false);
        console.error('❌ fetchProfile error:', err);
      },
    });
  }

  fetchUsers(query: UserQuery): void {
    this.loadingSignal.set(true);
    this.errorSignal.set('');

    this.userService.getUsers(query).subscribe({
      next: (users) => {
        this.usersSignal.set(users);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
        this.loadingSignal.set(false);
        console.error('❌ user.store.ts error:', err);
      },
    });
  }

  updateUser(user: User) {
    this.loadingSignal.set(true);
    return this.userService
      .updateUserProfile(user.id, {
        name: user.name,
        phoneNumber: user.phoneNumber,
        address: user.address,
        avatar: user.avatar,
      })
      .pipe(
        // ต่อ chain เพื่ออัปเดต role ต่อ
        tap(() => {
          if (user.role) {
            this.userService.updateUserRole(user.id, user.role).subscribe({
              next: () => {
                this.fetchProfile();
                this.loadingSignal.set(false);
              },
              error: (e) => {
                console.error('❌ update role error', e);
                this.loadingSignal.set(false);
              },
            });
          } else {
            this.loadingSignal.set(false);
          }
        })
      );
  }

  // private fetchUsersFromUser(user: User) {
  //   const query: UserQuery = {
  //     name: '',
  //     email: '',
  //     phoneNumber: '',
  //     orderBy: 'createdAt',
  //     order: 'desc',
  //     page: 1,
  //     perPage: 10,
  //   };
  //   this.fetchUsers(query);
  // }

  deleteUser(userId: string, query: UserQuery): void {
    this.loadingSignal.set(true);
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.fetchUsers(query);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set('ไม่สามารถลบผู้ใช้ได้');
        this.loadingSignal.set(false);
        console.error('❌ delete error:', err);
      },
    });
  }

  clearUsers() {
    this.usersSignal.set([]);
  }

  updateUserLocal(id: string, updated: Partial<User>) {
    this.usersSignal.update((users) =>
      users.map((u) => (u.id === id ? { ...u, ...updated } : u))
    );
  }
}
