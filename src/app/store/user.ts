// ✅ user.store.ts
import { Injectable, computed, effect, signal } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
import { UserService } from '../services/user';
import { User, UserQuery } from '../services/user.interface';
import { AuthStore } from './auth';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private usersSignal = signal<User[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal('');

  users = computed(() => this.usersSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());

  filteredUsers = computed(() => {
    const users = this.usersSignal();
    const profile = this.authStore.profile();

    // console.log('🧪 profile:', profile);
    // console.log('🧪 users:', users);
    return profile ? users.filter((u) => u.id !== profile.id) : users;
  });

  constructor(private userService: UserService, private authStore: AuthStore) {
    // effect(() => {
    //   const profile = this.authStore.profile();
    //   const users = this.usersSignal();
    //   console.log('🟡 Effect: profile or users changed');
    //   console.log('🧪 profile:', profile);
    //   console.log('🧪 users:', users);
    // });
  }

  // fetchUsers(query: UserQuery): void {
  //   this.loadingSignal.set(true);
  //   this.errorSignal.set('');

  //   this.userService.getUsers(query).subscribe({
  //     next: (users) => {
  //       this.usersSignal.set(users);
  //       this.loadingSignal.set(false);
  //     },
  //     error: (err) => {
  //       this.errorSignal.set('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
  //       this.loadingSignal.set(false);
  //       console.error('❌ user.store.ts error:', err);
  //     },
  //   });
  // }
  async fetchUsers(query: UserQuery): Promise<void> {
    this.loadingSignal.set(true);
    try {
      const users = await firstValueFrom(this.userService.getUsers(query));
      this.usersSignal.set(users);
    } catch (err) {
      console.error('❌ user.store.ts error:', err);
      this.errorSignal.set('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // updateUser(user: User) {
  //   this.loadingSignal.set(true);
  //   return this.userService
  //     .updateUserProfile(user.id, {
  //       name: user.name,
  //       phoneNumber: user.phoneNumber,
  //       address: user.address,
  //       avatar: user.avatar,
  //     })
  //     .pipe(
  //       // ต่อ chain เพื่ออัปเดต role ต่อ
  //       tap(() => {
  //         if (user.role) {
  //           this.userService.updateUserRole(user.id, user.role).subscribe({
  //             next: () => {
  //               this.loadingSignal.set(false);
  //             },
  //             error: (e) => {
  //               console.error('❌ update role error', e);
  //               this.loadingSignal.set(false);
  //             },
  //           });
  //         } else {
  //           this.loadingSignal.set(false);
  //         }
  //       })
  //     );
  // }
  async updateUser(user: User): Promise<void> {
    this.loadingSignal.set(true);
    try {
      await firstValueFrom(
        this.userService.updateUserProfile(user.id, {
          name: user.name,
          phoneNumber: user.phoneNumber,
          address: user.address,
          avatar: user.avatar,
        })
      );

      if (user.role) {
        await firstValueFrom(
          this.userService.updateUserRole(user.id, user.role)
        );
      }
    } catch (err) {
      console.error('❌ updateUser error:', err);
      this.errorSignal.set('ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // deleteUser(userId: string, query: UserQuery): void {
  //   this.loadingSignal.set(true);
  //   this.userService.deleteUser(userId).subscribe({
  //     next: () => {
  //       this.fetchUsers(query);
  //       this.loadingSignal.set(false);
  //     },
  //     error: (err) => {
  //       this.errorSignal.set('ไม่สามารถลบผู้ใช้ได้');
  //       this.loadingSignal.set(false);
  //       console.error('❌ delete error:', err);
  //     },
  //   });
  // }
  async deleteUser(id: string): Promise<void> {
    this.loadingSignal.set(true);
    try {
      await firstValueFrom(this.userService.deleteUser(id));
    } catch (err) {
      console.error('❌ deleteProduct error:', err);
      this.errorSignal.set('ไม่สามารถลบผู้ใช้ได้');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  clearUsers() {
    this.usersSignal.set([]);
  }
}
