import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { User, UserQuery } from '../../services/user.interface';
import { EditUserModal } from '../../shared/modals/edit-user-modal/edit-user-modal';
import { LoadingOverlay } from '../../shared/loading-overlay/loading-overlay';
import { UserStore } from '../../store/user';
import { AuthStore } from '../../store/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, EditUserModal, LoadingOverlay],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  userStore = inject(UserStore);
  authStore = inject(AuthStore);

  isEditModalVisible = false;
  selectedUser: User | null = null;
  query: UserQuery = {
    name: '',
    email: '',
    phoneNumber: '',
    orderBy: 'createdAt',
    order: 'desc',
    page: 1,
    perPage: 10,
  };

  // ✅ reactive ทุกครั้งที่ render
  get profile() {
    return this.authStore.profile();
  }

  get users() {
    return this.userStore.filteredUsers();
  }

  get loading() {
    return this.userStore.loading();
  }

  get error() {
    return this.userStore.error();
  }

  ngOnInit(): void {
    this.authStore
      .fetchProfile()
      .then(() => {
        this.userStore.fetchUsers(this.query);
      })
      .catch(() => {
        alert('ไม่สามารถโหลดโปรไฟล์ผู้ใช้ได้');
      });
  }

  onSearch(): void {
    this.query.page = 1;
    this.userStore.fetchUsers(this.query);
  }

  goToPreviousPage() {
    if (this.query.page > 1) {
      this.query.page--;
      this.userStore.fetchUsers(this.query);
    }
  }

  goToNextPage() {
    this.query.page++;
    this.userStore.fetchUsers(this.query);
  }

  openEditModal(user: User) {
    this.selectedUser = user;
    this.isEditModalVisible = true;
  }

  // updateUser(updatedUser: User) {
  //   this.userStore.updateUser(updatedUser).subscribe({
  //     next: () => {
  //       this.isEditModalVisible = false;
  //       this.userStore.fetchUsers(this.query);
  //     },
  //     error: () => alert('เกิดข้อผิดพลาดในการอัปเดตผู้ใช้'),
  //   });
  // }
  async updateUser(updatedUser: User): Promise<void> {
    try {
      await this.userStore.updateUser(updatedUser);
      this.isEditModalVisible = false;
      await this.userStore.fetchUsers(this.query);
    } catch (err) {
      console.error('❌ updateUser error', err);
      alert('เกิดข้อผิดพลาดในการอัปเดตผู้ใช้');
    }
  }

  // confirmDelete(userId: string) {
  //   const confirmed = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสมาชิกนี้?');
  //   if (confirmed) {
  //     this.userStore
  //       .deleteUser(userId)
  //       .then(() => {
  //         this.userStore.fetchUsers(this.query);
  //       })
  //       .catch(() => {
  //         alert('ไม่สามารถโหลดโปรไฟล์ผู้ใช้ได้');
  //       });
  //   }
  // }
  async confirmDelete(userId: string): Promise<void> {
    const confirmed = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสมาชิกนี้?');
    if (!confirmed) return;

    try {
      await this.userStore.deleteUser(userId);
      await this.userStore.fetchUsers(this.query);
    } catch (err) {
      console.error('❌ deleteUser error:', err);
      alert('ไม่สามารถโหลดโปรไฟล์ผู้ใช้ได้');
    }
  }

  canManageUsers(): boolean {
    if (this.profile) {
      return this.profile.role === 'STAFF' || this.profile.role === 'ADMIN';
    } else {
      return false;
    }
  }
}
