import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { LoadingOverlay } from '../../shared/loading-overlay/loading-overlay';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingOverlay],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss'],
})
export class Auth {
  isLoginMode = true;
  email = '';
  password = '';
  name = '';
  loading = false; // ✅ เพิ่ม

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef // ✅ เพิ่ม
  ) {}

  toggleMode(form: NgForm) {
    this.isLoginMode = !this.isLoginMode;
    this.resetForm(form); // ล้างฟอร์มทุกครั้งที่สลับโหมด
  }

  onSubmit(form: NgForm) {
    this.loading = true; // ✅ เริ่ม loading
    this.cdr.detectChanges();

    if (this.isLoginMode) {
      this.authService
        .login({ email: this.email, password: this.password })
        .subscribe({
          next: (res) => {
            this.loading = false; // ✅ ปิด loading
            console.log('Login success:', res);
            this.cdr.detectChanges();
            this.router.navigate(['/home']);
          },
          error: (err) => {
            this.loading = false; // ✅ ปิด loading
            this.cdr.detectChanges();
            console.error('Login error:', err);
            alert('เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลหรือรหัสผ่าน');
          },
        });
    } else {
      this.authService
        .createAdmin({
          name: this.name,
          email: this.email,
          password: this.password,
        })
        .subscribe({
          next: (res) => {
            this.loading = false; // ✅ ปิด loading
            console.log('Register success:', res);
            this.cdr.detectChanges();
            alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
            this.isLoginMode = true;
            this.resetForm(form); // ✅ ล้างฟอร์มจริง
          },
          error: (err) => {
            this.loading = false; // ✅ ปิด loading
            console.error('Register error:', err);
            this.cdr.detectChanges();
            alert('สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่');
          },
        });
    }
  }

  private resetForm(form: NgForm) {
    this.name = '';
    this.email = '';
    this.password = '';
    form.resetForm(); // ✅ reset ทั้ง input, touched state, validation ฯลฯ
  }
}
