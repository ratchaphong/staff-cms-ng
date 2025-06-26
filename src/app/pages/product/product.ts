import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { LoadingOverlay } from '../../shared/loading-overlay/loading-overlay';
import { ProductStore } from '../../store/product';
import { AuthStore } from '../../store/auth';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, RouterModule, LoadingOverlay],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class ProductPage implements OnInit {
  private productStore = inject(ProductStore);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  get profile() {
    return this.authStore.profile();
  }

  get products() {
    return this.productStore.products();
  }

  get loading() {
    return this.productStore.loading();
  }

  get error() {
    return this.productStore.error();
  }

  ngOnInit(): void {
    this.authStore
      .fetchProfile()
      .then(() => {
        this.productStore.fetchProducts();
      })
      .catch(() => {
        alert('ไม่สามารถโหลดโปรไฟล์ผู้ใช้ได้');
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
