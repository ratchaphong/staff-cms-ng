import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-device-blocker',
  imports: [CommonModule],
  templateUrl: './device-blocker.html',
  styleUrl: './device-blocker.scss',
})
export class DeviceBlocker {
  isBlocked = false;

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    // ป้องกัน error เวลา SSR
    if (typeof window !== 'undefined') {
      this.isBlocked = window.innerWidth < 1024;
    } else {
      this.isBlocked = false; // หรือ true ถ้าต้องการ block เสมอใน SSR
    }
  }
}
