import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { clearToken } from '../../utils/helpers';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private router = inject(Router);

  links = [
    { path: '/home', label: 'จัดการสมาชิก' },
    { path: '/product', label: 'จัดการผลิตภัณฑ์' },
    { path: '/profile', label: 'ดูโปรไฟล์' },
  ];

  logout() {
    clearToken();
    this.router.navigate(['/']);
  }
}
