import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { User, UserQuery } from '../../services/user.interface';
import { UserService } from '../../services/user';
import { EditUserModal } from '../../shared/modals/edit-user-modal/edit-user-modal';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, EditUserModal],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
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
    private cdr: ChangeDetectorRef // ✅ เพิ่ม
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges(); // ✅ แจ้งให้ UI รู้ว่า loading = true แล้ว

    this.userService.getUsers(this.query).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
        this.cdr.detectChanges(); // ✅ รีเฟรช view หลังโหลดเสร็จ
      },
      error: () => {
        this.error = 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้';
        this.loading = false;
        this.cdr.detectChanges(); // ✅ อัปเดต error และสถานะ
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
}
