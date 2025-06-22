import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss'],
})
export class Auth {
  isLoginMode = true;
  email = '';
  password = '';
  name = '';

  constructor(private router: Router, private authService: AuthService) {}

  toggleMode(form: NgForm) {
    this.isLoginMode = !this.isLoginMode;
    this.resetForm(form); // ล้างฟอร์มทุกครั้งที่สลับโหมด
  }

  onSubmit(form: NgForm) {
    if (this.isLoginMode) {
      this.authService
        .login({ email: this.email, password: this.password })
        .subscribe({
          next: (res) => {
            console.log('Login success:', res);
            this.router.navigate(['/home']);
          },
          error: (err) => {
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
            console.log('Register success:', res);
            alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
            this.isLoginMode = true;
            this.resetForm(form); // ✅ ล้างฟอร์มจริง
          },
          error: (err) => {
            console.error('Register error:', err);
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
