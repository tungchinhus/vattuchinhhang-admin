import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserFormData, UserRole, ROLE_DISPLAY_NAMES } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" #userForm="ngForm" class="user-form">
      <div class="form-group">
        <label for="name">Tên người dùng *</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          [(ngModel)]="formData.name" 
          required 
          class="form-control"
          placeholder="Nhập tên người dùng">
      </div>

      <div class="form-group">
        <label for="email">Email *</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          [(ngModel)]="formData.email" 
          required 
          email
          class="form-control"
          placeholder="Nhập email">
      </div>

      <div class="form-group">
        <label for="role">Vai trò *</label>
        <select 
          id="role" 
          name="role" 
          [(ngModel)]="formData.role" 
          required 
          class="form-control">
          <option value="">Chọn vai trò</option>
          <option *ngFor="let role of userRoles" [value]="role">
            {{ ROLE_DISPLAY_NAMES[role] }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="avatar">Ảnh đại diện</label>
        <input 
          type="file" 
          id="avatar" 
          name="avatar" 
          (change)="onAvatarChange($event)"
          accept="image/*"
          class="form-control">
        <div *ngIf="formData.avatarUrl" class="avatar-preview">
          <img [src]="formData.avatarUrl" alt="Avatar preview" class="preview-image">
        </div>
      </div>

      <div class="form-actions">
        <button type="button" (click)="onCancel()" class="btn btn-secondary">
          Hủy
        </button>
        <button type="submit" [disabled]="!userForm.form.valid || isLoading" class="btn btn-primary">
          {{ isLoading ? 'Đang lưu...' : 'Lưu' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .user-form {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .avatar-preview {
      margin-top: 10px;
    }

    .preview-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 50%;
      border: 2px solid #ddd;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 30px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }
  `]
})
export class UserFormComponent {
  @Input() initialData: Partial<UserFormData> = {};
  @Input() isLoading = false;
  @Output() formSubmit = new EventEmitter<UserFormData>();
  @Output() formCancel = new EventEmitter<void>();

  formData: UserFormData = {
    name: '',
    email: '',
    role: UserRole.CUSTOMER,
    avatarUrl: ''
  };

  userRoles = Object.values(UserRole);
  ROLE_DISPLAY_NAMES = ROLE_DISPLAY_NAMES;

  ngOnInit() {
    if (this.initialData) {
      this.formData = { ...this.formData, ...this.initialData };
    }
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData.avatarUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.formData.name && this.formData.email && this.formData.role) {
      this.formSubmit.emit(this.formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
