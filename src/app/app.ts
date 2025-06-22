import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeviceBlocker } from './shared/device-blocker/device-blocker';
import { AuthService } from './services/auth';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DeviceBlocker],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private authService = inject(AuthService);
  private titleService = inject(Title); // ✅ Inject Title service

  ngOnInit(): void {
    this.titleService.setTitle('CMS Admin');

    this.checkTokenExpiration();

    // ตรวจสอบ token ทุก 1 นาที
    setInterval(() => {
      this.checkTokenExpiration();
    }, 60 * 1000);
  }

  private checkTokenExpiration() {
    const token = this.authService.getToken();
    const tokenTime = this.authService.getTokenTime();
    const oneHour = 60 * 60 * 1000;

    if (token && tokenTime) {
      const age = Date.now() - parseInt(tokenTime, 10);
      if (age > oneHour) {
        this.authService.clearToken();
      }
    }
  }
}
