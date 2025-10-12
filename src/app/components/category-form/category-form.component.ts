import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryFormData } from '../../models/category.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" #categoryForm="ngForm" class="category-form">
      <div class="form-group">
        <label for="name">Tên danh mục *</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          [(ngModel)]="formData.name" 
          required 
          class="form-control"
          placeholder="Nhập tên danh mục">
      </div>

      <div class="form-group">
        <label for="icon">Icon danh mục</label>
        <input 
          type="file" 
          id="icon" 
          name="icon" 
          (change)="onIconChange($event)"
          accept="image/*"
          class="form-control">
        <div *ngIf="formData.iconUrl" class="icon-preview">
          <img [src]="formData.iconUrl" alt="Icon preview" class="preview-image">
        </div>
      </div>

      <div class="form-actions">
        <button type="button" (click)="onCancel()" class="btn btn-secondary">
          Hủy
        </button>
        <button type="submit" [disabled]="!categoryForm.form.valid || isLoading" class="btn btn-primary">
          {{ isLoading ? 'Đang lưu...' : 'Lưu' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .category-form {
      max-width: 400px;
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

    .icon-preview {
      margin-top: 10px;
    }

    .preview-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
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
export class CategoryFormComponent {
  @Input() initialData: Partial<CategoryFormData> = {};
  @Input() isLoading = false;
  @Output() formSubmit = new EventEmitter<CategoryFormData>();
  @Output() formCancel = new EventEmitter<void>();

  formData: CategoryFormData = {
    name: '',
    iconUrl: ''
  };

  ngOnInit() {
    if (this.initialData) {
      this.formData = { ...this.formData, ...this.initialData };
    }
  }

  onIconChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData.iconUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.formData.name) {
      this.formSubmit.emit(this.formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
