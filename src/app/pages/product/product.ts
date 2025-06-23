import { CommonModule } from '@angular/common';
import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../services/product.interface';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AuthService } from '../../services/auth';
import { User } from '../../services/user.interface';
import { LoadingOverlay } from '../../shared/loading-overlay/loading-overlay';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, RouterModule, LoadingOverlay],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class ProductPage implements OnInit {
  profile: User | null = null;
  products: Product[] = [];
  loading = false;
  error = '';

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.fetchProducts();
      },
      error: () => {
        this.error = 'ไม่สามารถโหลดโปรไฟล์ผู้ใช้ได้';
        this.loading = false; // ✅ ปิด loading ทันทีเมื่อ error
        this.cdr.detectChanges();
      },
    });
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges(); // ✅ บังคับ refresh UI
      },
      error: (err) => {
        this.error = 'โหลดข้อมูลผิดพลาด';
        this.loading = false;
        this.cdr.detectChanges(); // ✅ บังคับ refresh UI
      },
    });
  }

  goToDetail(id: string): void {
    this.router.navigate(['/product', id]);
  }

  goToCreate(): void {
    this.router.navigate(['/product/create']);
  }

  canManageProducts(): boolean {
    return this.profile?.role === 'STAFF' || this.profile?.role === 'ADMIN';
  }
}
