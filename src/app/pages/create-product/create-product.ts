import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductService } from '../../services/product';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Product } from '../../services/product.interface';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, RouterModule],
  templateUrl: './create-product.html',
  styleUrl: './create-product.scss',
})
export class CreateProduct {
  form: Partial<Product> = {
    name: '',
    description: '',
    price: 0,
    status: 'ACTIVE',
    image: '',
  };
  imagePreview: SafeUrl | null = null;

  error = '';
  constructor(
    private productService: ProductService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef // ✅ เพิ่มตรงนี้
  ) {}

  onSubmit(): void {
    this.productService.createProduct(this.form).subscribe({
      next: () => {
        this.router.navigate(['/product']);
      },
      error: (err) => {
        this.error = 'เกิดข้อผิดพลาดในการสร้างผลิตภัณฑ์';
        console.error(err);
      },
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      this.form.image = base64; // แปลงเป็น base64 string
      this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(base64); // ✅
      console.log('👀 this.cdr =', this.cdr); // ถ้าเป็น undefined ที่นี่จะรู้เลย
      this.cdr.detectChanges(); // ✅ บังคับ Angular อัปเดต UI
    };

    reader.readAsDataURL(file);
  }
}
