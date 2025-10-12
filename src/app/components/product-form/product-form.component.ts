import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductFormData, ProductStatus, STATUS_DISPLAY_NAMES } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" #productForm="ngForm" class="product-form">
      <div class="form-group">
        <label for="name">Tên sản phẩm *</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          [(ngModel)]="formData.name" 
          required 
          class="form-control"
          placeholder="Nhập tên sản phẩm">
      </div>

      <div class="form-group">
        <label for="description">Mô tả *</label>
        <textarea 
          id="description" 
          name="description" 
          [(ngModel)]="formData.description" 
          required 
          rows="4"
          class="form-control"
          placeholder="Nhập mô tả sản phẩm"></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="price">Giá *</label>
          <input 
            type="number" 
            id="price" 
            name="price" 
            [(ngModel)]="formData.price" 
            required 
            min="0"
            step="1000"
            class="form-control"
            placeholder="Nhập giá sản phẩm">
        </div>

        <div class="form-group">
          <label for="stock">Số lượng tồn kho *</label>
          <input 
            type="number" 
            id="stock" 
            name="stock" 
            [(ngModel)]="formData.stock" 
            required 
            min="0"
            class="form-control"
            placeholder="Nhập số lượng">
        </div>
      </div>

      <div class="form-group">
        <label for="categoryId">Danh mục *</label>
        <select 
          id="categoryId" 
          name="categoryId" 
          [(ngModel)]="formData.categoryId" 
          required 
          class="form-control">
          <option value="">Chọn danh mục</option>
          <option *ngFor="let category of categories" [value]="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="status">Trạng thái *</label>
        <select 
          id="status" 
          name="status" 
          [(ngModel)]="formData.status" 
          required 
          class="form-control">
          <option *ngFor="let status of productStatuses" [value]="status">
            {{ STATUS_DISPLAY_NAMES[status] }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="images">Hình ảnh sản phẩm</label>
        <input 
          type="file" 
          id="images" 
          name="images" 
          (change)="onImagesChange($event)"
          accept="image/*"
          multiple
          class="form-control">
        <div *ngIf="formData.images.length > 0" class="images-preview">
          <div *ngFor="let image of formData.images; let i = index" class="image-item">
            <img [src]="image" alt="Product image" class="preview-image">
            <button type="button" (click)="removeImage(i)" class="remove-btn">×</button>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" (click)="onCancel()" class="btn btn-secondary">
          Hủy
        </button>
        <button type="submit" [disabled]="!productForm.form.valid || isLoading" class="btn btn-primary">
          {{ isLoading ? 'Đang lưu...' : 'Lưu' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .product-form {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
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

    textarea.form-control {
      resize: vertical;
    }

    .images-preview {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
      margin-top: 10px;
    }

    .image-item {
      position: relative;
    }

    .preview-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 4px;
      border: 2px solid #ddd;
    }

    .remove-btn {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #dc3545;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-btn:hover {
      background-color: #c82333;
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
export class ProductFormComponent implements OnInit {
  @Input() initialData: Partial<ProductFormData> = {};
  @Input() categories: Category[] = [];
  @Input() isLoading = false;
  @Output() formSubmit = new EventEmitter<ProductFormData>();
  @Output() formCancel = new EventEmitter<void>();

  formData: ProductFormData = {
    sellerId: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    images: [],
    categoryId: '',
    status: ProductStatus.PENDING
  };

  productStatuses = Object.values(ProductStatus);
  STATUS_DISPLAY_NAMES = STATUS_DISPLAY_NAMES;

  ngOnInit() {
    if (this.initialData) {
      this.formData = { ...this.formData, ...this.initialData };
    }
  }

  onImagesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.formData.images.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number) {
    this.formData.images.splice(index, 1);
  }

  onSubmit() {
    if (this.formData.name && this.formData.description && this.formData.price > 0 && this.formData.categoryId) {
      this.formSubmit.emit(this.formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
