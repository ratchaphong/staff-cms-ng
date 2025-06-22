import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product } from '../../services/product.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-product',
  imports: [CommonModule, FormsModule, Sidebar, RouterModule],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss',
})
export class EditProduct implements OnInit {
  form: Partial<Product> = {
    name: '',
    description: '',
    price: 0,
    status: 'ACTIVE',
    image: '',
  };
  imagePreview: SafeUrl | null = null;

  error = '';
  productId = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef // ✅ เพิ่มตรงนี้
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (data) => {
          this.form = {
            name: data.name,
            description: data.description,
            price: data.price,
            status: data.status,
            image: data.image,
          };
        },
        error: () => {
          this.error = 'ไม่พบสินค้านี้';
        },
      });
    }
  }

  onSubmit(): void {
    this.productService
      .updateProduct(this.productId, {
        ...this.form,
        status: this.form.status,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/product']);
        },
        error: (err) => {
          this.error = 'เกิดข้อผิดพลาดในการอัปเดต';
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
