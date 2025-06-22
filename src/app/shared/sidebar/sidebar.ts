import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private router = inject(Router);
  private authService = inject(AuthService);

  links = [
    { path: '/home', label: 'หน้าดูแลสมาชิก' },
    { path: '/profile', label: 'ดูโปรไฟล์' },
  ];

  logout() {
    this.authService.clearToken();
    this.router.navigate(['/']);
  }
}
