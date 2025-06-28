import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { clearToken, getAccessToken } from '../../utils/helpers';
import { LogoComponent } from '../logo/logo.component';
import { AuthStore } from '../../store/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private router = inject(Router);
  private authStore = inject(AuthStore);

  links = [
    { path: '/home', label: 'จัดการสมาชิก' },
    { path: '/product', label: 'จัดการผลิตภัณฑ์' },
    { path: '/profile', label: 'ดูโปรไฟล์' },
    { path: '/login-history', label: 'ดูประวัติการเข้าสู่ระบบ' },
  ];

  async logout() {
    await this.authStore.logout();
    clearToken();
    this.router.navigate(['/']);
  }

  get salesPageUrl(): string {
    const token = getAccessToken();
    return `https://sales-here-the-best-thing.vercel.app/sso/${token}`;
  }
}
