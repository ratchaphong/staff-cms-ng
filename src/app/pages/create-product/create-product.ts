import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { CreateProductPayload } from '../../services/product.interface';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProductStore } from '../../store/product';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, RouterModule],
  templateUrl: './create-product.html',
  styleUrl: './create-product.scss',
})
export class CreateProduct {
  private productStore = inject(ProductStore);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  form: CreateProductPayload = {
    name: '',
    description: '',
    price: 0,
    status: 'ACTIVE',
    image: '',
  };

  imagePreview: SafeUrl | null = null;
  error = '';

  async onSubmit(): Promise<void> {
    try {
      await this.productStore.createProduct(this.form);
      this.router.navigate(['/product']);
    } catch (err) {
      this.error = 'เกิดข้อผิดพลาดในการสร้างผลิตภัณฑ์';
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
}
