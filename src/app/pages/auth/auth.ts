import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthStore } from '../../../store/auth';
import { LoadingOverlay } from '../../shared/loading-overlay/loading-overlay';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router, private authStore: AuthStore) {}

  toggleMode(form: NgForm) {
    this.isLoginMode = !this.isLoginMode;
    this.resetForm(form);
  }

  async onSubmit(form: NgForm) {
    try {
      if (this.isLoginMode) {
        await this.authStore.login({
          email: this.email,
          password: this.password,
        });
        this.router.navigate(['/home']);
      } else {
        await this.authStore.register({
          name: this.name,
          email: this.email,
          password: this.password,
        });
        alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
        this.isLoginMode = true;
        this.resetForm(form);
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด โปรดลองใหม่');
    } finally {
    }
  }

  private resetForm(form: NgForm) {
    this.name = '';
    this.email = '';
    this.password = '';
    form.resetForm();
  }

  get loading() {
    return this.authStore.loading();
  }
}
