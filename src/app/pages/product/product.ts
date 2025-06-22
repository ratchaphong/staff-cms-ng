import { CommonModule } from '@angular/common';
import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../services/product.interface';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, RouterModule],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class ProductPage implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading = true;
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
}
