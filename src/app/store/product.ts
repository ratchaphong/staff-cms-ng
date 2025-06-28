// ✅ product.store.ts
import { Injectable, computed, signal } from '@angular/core';
import { ProductService } from '../services/product';
import {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from '../services/product.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductStore {
  private productsSignal = signal<Product[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal('');
  private selectedSignal = signal<Product | null>(null);

  products = computed(() => this.productsSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());
  selected = computed(() => this.selectedSignal());

  constructor(private productService: ProductService) {}

  //   fetchProducts(): void {
  //     this.loadingSignal.set(true);
  //     this.errorSignal.set('');
  //     this.productService.getProducts().subscribe({
  //       next: (products) => {
  //         this.productsSignal.set(products);
  //         this.loadingSignal.set(false);
  //       },
  //       error: (err) => {
  //         this.errorSignal.set('ไม่สามารถโหลดสินค้าทั้งหมดได้');
  //         this.loadingSignal.set(false);
  //         console.error('❌ fetchProducts error:', err);
  //       },
  //     });
  //   }

  async fetchProducts(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set('');
    this.productsSignal.set([]);

    try {
      const products = await firstValueFrom(this.productService.getProducts());
      this.productsSignal.set(products);
    } catch (err) {
      this.errorSignal.set('ไม่สามารถโหลดสินค้าทั้งหมดได้');
      console.error('❌ fetchProducts error:', err);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // fetchProductById(id: string): void {
  //   this.loadingSignal.set(true);
  //   this.productService.getProductById(id).subscribe({
  //     next: (product) => {
  //       this.selectedSignal.set(product);
  //       this.loadingSignal.set(false);
  //     },
  //     error: (err) => {
  //       this.errorSignal.set('ไม่สามารถโหลดข้อมูลสินค้าได้');
  //       this.loadingSignal.set(false);
  //       console.error('❌ fetchProductById error:', err);
  //     },
  //   });
  // }
  async fetchProductById(id: string): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set('');

    try {
      const products = await firstValueFrom(
        this.productService.getProductById(id)
      );
      this.selectedSignal.set(products);
    } catch (err) {
      this.errorSignal.set('ไม่สามารถโหลดสินค้าทั้งหมดได้');
      console.error('❌ fetchProducts error:', err);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // createProduct(product: Partial<Product>): void {
  //   this.loadingSignal.set(true);
  //   this.productService.createProduct(product).subscribe({
  //     next: () => this.fetchProducts(),
  //     error: (err) => {
  //       this.errorSignal.set('ไม่สามารถสร้างสินค้าได้');
  //       this.loadingSignal.set(false);
  //       console.error('❌ createProduct error:', err);
  //     },
  //   });
  // }
  async createProduct(payload: CreateProductPayload): Promise<void> {
    try {
      this.loadingSignal.set(true);
      const created = await firstValueFrom(
        this.productService.createProduct(payload)
      );
      this.productsSignal.update((products) => [...products, created]);
    } catch (err) {
      console.error('❌ createProduct error:', err);
      this.errorSignal.set('ไม่สามารถสร้างสินค้าได้');
      throw err;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // updateProduct(id: string, data: Partial<Product>): void {
  //   this.loadingSignal.set(true);
  //   this.productService.updateProduct(id, data).subscribe({
  //     next: () => this.fetchProducts(),
  //     error: (err) => {
  //       this.errorSignal.set('ไม่สามารถอัปเดตสินค้าได้');
  //       this.loadingSignal.set(false);
  //       console.error('❌ updateProduct error:', err);
  //     },
  //   });
  // }
  async updateProduct(id: string, data: UpdateProductPayload): Promise<void> {
    try {
      this.loadingSignal.set(true);
      await firstValueFrom(this.productService.updateProduct(id, data));
    } catch (err) {
      console.error('❌ updateProduct error:', err);
      this.errorSignal.set('ไม่สามารถอัปเดตสินค้าได้');
      throw err;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // deleteProduct(id: string): void {
  //   this.loadingSignal.set(true);
  //   this.productService.deleteProduct(id).subscribe({
  //     next: () => this.fetchProducts(),
  //     error: (err) => {
  //       this.errorSignal.set('ไม่สามารถลบสินค้าได้');
  //       this.loadingSignal.set(false);
  //       console.error('❌ deleteProduct error:', err);
  //     },
  //   });
  // }
  async deleteProduct(id: string): Promise<void> {
    try {
      this.loadingSignal.set(true);
      await firstValueFrom(this.productService.deleteProduct(id));
    } catch (err) {
      console.error('❌ deleteProduct error:', err);
      this.errorSignal.set('ไม่สามารถลบสินค้าได้');
      throw err;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  clearSelected() {
    this.selectedSignal.set(null);
  }
}
