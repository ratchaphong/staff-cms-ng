import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UpdateProductPayload } from '../../services/product.interface';
import { AuthStore } from '../../store/auth';
import { ProductStore } from '../../store/product';

@Component({
  selector: 'app-edit-product',
  imports: [CommonModule, FormsModule, Sidebar, RouterModule],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss',
})
export class EditProduct implements OnInit {
  private authStore = inject(AuthStore);
  private productStore = inject(ProductStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  form: UpdateProductPayload = {
    name: '',
    description: '',
    price: 0,
    status: 'ACTIVE',
    image: '',
  };

  imagePreview: SafeUrl | null = null;
  error = '';
  productId = '';

  async ngOnInit(): Promise<void> {
    this.productId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.productId) return;

    try {
      const profile = this.authStore.profile();
      if (!profile) {
        this.error = 'ไม่สามารถโหลดโปรไฟล์ผู้ใช้ได้';
        return;
      }

      await this.productStore.fetchProductById(this.productId);
      const product = this.productStore.selected();

      if (!product) {
        this.error = 'ไม่พบสินค้านี้';
        return;
      }

      this.form = {
        name: product.name,
        description: product.description,
        price: product.price,
        status: product.status,
        image: product.image,
      };

      this.imagePreview = product.image;
      this.cdr.detectChanges();
    } catch (err) {
      this.error = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
      console.error(err);
    }
  }

  async onSubmit(): Promise<void> {
    try {
      await this.productStore.updateProduct(this.productId, this.form);
      this.router.navigate(['/product']);
    } catch (err) {
      this.error = 'เกิดข้อผิดพลาดในการอัปเดต';
      console.error(err);
    }
  }

  async onDelete(): Promise<void> {
    const confirmed = confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?');
    if (!confirmed) return;

    try {
      await this.productStore.deleteProduct(this.productId);
      this.router.navigate(['/product']);
    } catch (err) {
      this.error = 'ไม่สามารถลบสินค้าได้';
      console.error(err);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      this.form.image = base64;
      this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(base64);
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }

  canManageProducts(): boolean {
    return (
      this.authStore.profile()?.role === 'STAFF' ||
      this.authStore.profile()?.role === 'ADMIN'
    );
  }
}
