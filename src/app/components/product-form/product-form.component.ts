import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '../../services/product.service';
import { ProductStatus } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  template: `
  <div class="p-4">
    <h2>Thêm sản phẩm</h2>
    <div class="form-grid" style="display:grid; grid-template-columns: repeat(2, 1fr); gap:12px;">
      <mat-form-field appearance="outline">
        <mat-label>Supplier ID</mat-label>
        <input matInput [(ngModel)]="supplierId" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Tên</mat-label>
        <input matInput [(ngModel)]="name" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Slug</mat-label>
        <input matInput [(ngModel)]="slug" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Giá</mat-label>
        <input matInput type="number" [(ngModel)]="price" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-row" style="grid-column: 1 / -1;">
        <mat-label>Mô tả ngắn</mat-label>
        <textarea matInput rows="2" [(ngModel)]="shortDescription"></textarea>
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-row" style="grid-column: 1 / -1;">
        <mat-label>Mô tả chi tiết</mat-label>
        <textarea matInput rows="4" [(ngModel)]="fullDescription"></textarea>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Category ID</mat-label>
        <input matInput [(ngModel)]="category" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Tồn kho</mat-label>
        <input matInput type="number" [(ngModel)]="stock" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Trạng thái</mat-label>
        <mat-select [(ngModel)]="status">
          <mat-option value="pending">pending</mat-option>
          <mat-option value="approved">approved</mat-option>
          <mat-option value="rejected">rejected</mat-option>
          <mat-option value="hidden">hidden</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-row" style="grid-column: 1 / -1;">
        <mat-label>Specs (JSON)</mat-label>
        <textarea matInput rows="6" [(ngModel)]="specsJson" placeholder='{"numCores":11,"technology":"Smax Pro V"}'></textarea>
      </mat-form-field>
      <div class="full-row" style="grid-column: 1 / -1; display:flex; gap:8px;">
        <button mat-raised-button color="primary" (click)="save()">Lưu</button>
      </div>
    </div>
  </div>
  `,
})
export class ProductFormComponent {
  supplierId = '';
  name = '';
  slug = '';
  shortDescription = '';
  fullDescription = '';
  price = 0;
  images: string[] = [];
  category = '';
  stock = 0;
  status: ProductStatus = ProductStatus.PENDING;
  specsJson = '';

  constructor(private productService: ProductService) {}

  async save(): Promise<void> {
    try {
      const specs = this.specsJson ? JSON.parse(this.specsJson) : undefined;
      const id = await this.productService.createProduct(this.supplierId, {
        supplierId: this.supplierId,
        name: this.name,
        slug: this.slug,
        shortDescription: this.shortDescription,
        fullDescription: this.fullDescription,
        price: this.price,
        images: this.images,
        category: this.category,
        specs,
        stock: this.stock,
        status: this.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
      console.log('Created product id', id);
    } catch (e) {
      console.error(e);
    }
  }
}


