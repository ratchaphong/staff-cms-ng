import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../../store/auth';
import { LoadingOverlay } from '../../shared/loading-overlay/loading-overlay';
import { UpdateProfilePayload } from '../../services/auth.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, LoadingOverlay],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  editing = false;
  formData: UpdateProfilePayload = {
    name: '',
    avatar: '',
    phoneNumber: '',
    address: '',
  };

  constructor(public authStore: AuthStore, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // ถ้า profile ยังไม่โหลด ให้โหลด
    // if (!this.authStore.profile()) {
    //   this.authStore.fetchProfile();
    // }
  }

  toggleEdit(): void {
    this.editing = !this.editing;
    if (this.editing) {
      const p = this.authStore.profile();
      this.formData = {
        name: p?.name || '',
        avatar: p?.avatar || '',
        phoneNumber: p?.phoneNumber || '',
        address: p?.address || '',
      };
    }
  }

  cancelEdit(): void {
    this.editing = false;
    this.formData = {
      name: '',
      avatar: '',
      phoneNumber: '',
      address: '',
    };
  }

  async save(): Promise<void> {
    console.log('✅ บันทึกข้อมูลใหม่', this.formData);
    try {
      await this.authStore.updateProfile(this.formData);
      await this.authStore.fetchProfile();
    } catch (error) {
    } finally {
      this.editing = false;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData.avatar = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
