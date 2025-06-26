// ✅ auth.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { LoadingOverlay } from '../../shared/loading-overlay/loading-overlay';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../store/auth';
import { LoginPayload, RegisterPayload } from '../../services/auth.interface';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingOverlay],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss'],
})
export class Auth {
  isLoginMode = true;

  loginForm: LoginPayload = {
    email: '',
    password: '',
  };

  registerForm: RegisterPayload = {
    name: '',
    email: '',
    password: '',
  };

  constructor(private router: Router, private authStore: AuthStore) {}

  toggleMode(form: NgForm) {
    this.isLoginMode = !this.isLoginMode;
    this.resetForm(form);
  }

  async onSubmit(form: NgForm) {
    try {
      if (this.isLoginMode) {
        await this.authStore.login(this.loginForm);
        this.router.navigate(['/home']);
      } else {
        await this.authStore.register(this.registerForm);
        alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
        this.isLoginMode = true;
        this.resetForm(form);
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด โปรดลองใหม่');
    }
  }

  private resetForm(form: NgForm) {
    this.loginForm = { email: '', password: '' };
    this.registerForm = { name: '', email: '', password: '' };
    form.resetForm();
  }

  get loading() {
    return this.authStore.loading();
  }
}
