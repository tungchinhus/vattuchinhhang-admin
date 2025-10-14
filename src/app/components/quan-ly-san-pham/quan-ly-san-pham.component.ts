import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductStatus } from '../../models/product.model';

@Component({
  selector: 'app-quan-ly-san-pham',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatInputModule],
  template: `
  <div class="p-4">
    <h2>Quản lý sản phẩm</h2>
    <div class="filters" style="display:flex; gap:12px; align-items:center; margin: 12px 0;">
      <mat-form-field appearance="outline">
        <mat-label>Supplier ID</mat-label>
        <input matInput [(ngModel)]="supplierId" placeholder="Nhập supplierId" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Trạng thái</mat-label>
        <mat-select [(ngModel)]="status">
          <mat-option [value]="undefined">Tất cả</mat-option>
          <mat-option value="pending">Chờ duyệt</mat-option>
          <mat-option value="approved">Đã duyệt</mat-option>
          <mat-option value="rejected">Từ chối</mat-option>
          <mat-option value="hidden">Ẩn</mat-option>
        </mat-select>
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="reload()">Tải</button>
    </div>
    <table mat-table [dataSource]="products" class="mat-elevation-z1" *ngIf="products.length">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Tên</th>
        <td mat-cell *matCellDef="let p">{{ p.name }}</td>
      </ng-container>
      <ng-container matColumnDef="slug">
        <th mat-header-cell *matHeaderCellDef>Slug</th>
        <td mat-cell *matCellDef="let p">{{ p.slug }}</td>
      </ng-container>
      <ng-container matColumnDef="category">
        <th mat-header-cell *matHeaderCellDef>Danh mục</th>
        <td mat-cell *matCellDef="let p">{{ p.category }}</td>
      </ng-container>
      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef>Giá</th>
        <td mat-cell *matCellDef="let p">{{ p.price | number }}</td>
      </ng-container>
      <ng-container matColumnDef="stock">
        <th mat-header-cell *matHeaderCellDef>Tồn</th>
        <td mat-cell *matCellDef="let p">{{ p.stock }}</td>
      </ng-container>
      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Trạng thái</th>
        <td mat-cell *matCellDef="let p">{{ p.status }}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Hành động</th>
        <td mat-cell *matCellDef="let p">
          <button mat-icon-button color="primary" title="Duyệt" (click)="approve(p)" *ngIf="p.status==='pending'"><mat-icon>check</mat-icon></button>
          <button mat-icon-button color="warn" title="Từ chối" (click)="reject(p)" *ngIf="p.status==='pending'"><mat-icon>close</mat-icon></button>
          <button mat-icon-button title="Ẩn" (click)="hide(p)" *ngIf="p.status!=='hidden'"><mat-icon>visibility_off</mat-icon></button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <div *ngIf="!products.length" style="margin-top:12px;">Không có dữ liệu</div>
  </div>
  `,
})
export class QuanLySanPhamComponent implements OnInit {
  products: Product[] = [];
  displayedColumns = ['name', 'slug', 'category', 'price', 'stock', 'status', 'actions'];
  supplierId = '';
  status: ProductStatus | undefined = undefined;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {}

  async reload(): Promise<void> {
    if (!this.supplierId) {
      this.products = [];
      return;
    }
    this.products = await this.productService.listProductsBySupplier(this.supplierId, this.status);
  }

  async approve(p: Product): Promise<void> {
    if (p.supplierId) {
      await this.productService.updateProduct(p.supplierId, p.id, { status: ProductStatus.APPROVED });
      await this.reload();
    }
  }

  async reject(p: Product): Promise<void> {
    if (p.supplierId) {
      await this.productService.updateProduct(p.supplierId, p.id, { status: ProductStatus.REJECTED });
      await this.reload();
    }
  }

  async hide(p: Product): Promise<void> {
    if (p.supplierId) {
      await this.productService.updateProduct(p.supplierId, p.id, { status: ProductStatus.HIDDEN });
      await this.reload();
    }
  }
}


