import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { User, UserQuery } from '../../services/user.interface';
import { UserService } from '../../services/user';
import { EditUserModal } from '../../shared/modals/edit-user-modal/edit-user-modal';
import { AuthService } from '../../services/auth';
import { LoadingOverlay } from '../../shared/loading-overlay/loading-overlay';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, EditUserModal, LoadingOverlay],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  profile: User | null = null; // ✅ เก็บข้อมูลโปรไฟล์ของตัวเอง
  users: User[] = [];
  query: UserQuery = {
    name: '',
    email: '',
    phoneNumber: '',
    orderBy: 'createdAt',
    order: 'desc',
    page: 1,
    perPage: 10,
  };

  loading = false;
  error = '';
  isEditModalVisible = false;
  selectedUser: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService, // ✅ เพิ่ม
    private cdr: ChangeDetectorRef // ✅ เพิ่ม
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.fetchUsers();
      },
      error: () => {
        this.error = 'ไม่สามารถโหลดโปรไฟล์ผู้ใช้ได้';
      },
    });
  }

  fetchUsers(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.userService.getUsers(this.query).subscribe({
      next: (data) => {
        // ✅ กรอง user ที่ไม่ใช่ตัวเอง
        this.users = this.profile
          ? data.filter((u) => u.id !== this.profile?.id)
          : data;

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSearch(): void {
    this.query.page = 1;
    this.fetchUsers();
  }

  goToPreviousPage() {
    if (this.query && this.query.page && this.query.page > 1) {
      this.query.page--;
      this.fetchUsers();
    }
  }

  goToNextPage() {
    if (this.query) {
      this.query.page = (this.query.page || 1) + 1;
      this.fetchUsers();
    }
  }

  openEditModal(user: User) {
    this.selectedUser = user;
    this.isEditModalVisible = true;
  }

  updateUser(updatedUser: User) {
    if (!updatedUser?.id) return;

    this.userService
      .updateUserProfile(updatedUser.id, {
        name: updatedUser.name,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        avatar: updatedUser.avatar,
      })
      .subscribe({
        next: () => {
          // ✅ อัปเดตโปรไฟล์เสร็จแล้ว ค่อยอัปเดต role ต่อ
          this.userService
            .updateUserRole(updatedUser.id, updatedUser.role)
            .subscribe({
              next: () => {
                this.isEditModalVisible = false;
                this.fetchUsers(); // ✅ โหลดข้อมูลใหม่หลังอัปเดตเสร็จสมบูรณ์
              },
              error: () => {
                alert('เกิดข้อผิดพลาดในการอัปเดตบทบาท');
              },
            });
        },
        error: () => {
          alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้');
        },
      });
  }

  confirmDelete(userId: string) {
    const confirmDelete = window.confirm(
      'คุณแน่ใจหรือไม่ว่าต้องการลบสมาชิกนี้?'
    );
    if (confirmDelete) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.fetchUsers(); // refresh data
        },
        error: () => {
          alert('เกิดข้อผิดพลาด ไม่สามารถลบสมาชิกได้');
        },
      });
    }
  }

  canManageUsers(): boolean {
    return this.profile?.role === 'STAFF' || this.profile?.role === 'ADMIN';
  }
}
