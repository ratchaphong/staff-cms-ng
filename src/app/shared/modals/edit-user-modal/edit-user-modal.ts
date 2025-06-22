import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../services/user.interface';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user-modal.html',
  styleUrl: './edit-user-modal.scss',
})
export class EditUserModal {
  @Input() user!: User;
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();
  editedUser: User | null = null;

  ngOnChanges(): void {
    this.editedUser = this.user ? { ...this.user } : null;
  }

  onCancel() {
    this.cancel.emit();
  }

  onSave() {
    if (this.editedUser) {
      this.save.emit(this.editedUser);
    }
  }
}
