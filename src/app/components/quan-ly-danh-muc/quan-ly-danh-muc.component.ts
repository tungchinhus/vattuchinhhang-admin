import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/product.model';

@Component({
  selector: 'app-quan-ly-danh-muc',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule],
  template: `
  <div class="p-4">
    <h2>Danh mục sản phẩm</h2>
    <div style="display:flex; gap:12px; align-items:center; margin: 12px 0;">
      <mat-form-field appearance="outline">
        <mat-label>Tên danh mục</mat-label>
        <input matInput [(ngModel)]="newName" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Mô tả</mat-label>
        <input matInput [(ngModel)]="newDesc" />
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="create()">Thêm</button>
    </div>
    <table mat-table [dataSource]="categories" class="mat-elevation-z1" *ngIf="categories.length">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Tên</th>
        <td mat-cell *matCellDef="let c">{{ c.name }}</td>
      </ng-container>
      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>Mô tả</th>
        <td mat-cell *matCellDef="let c">{{ c.description }}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Hành động</th>
        <td mat-cell *matCellDef="let c">
          <button mat-icon-button color="warn" title="Xóa" (click)="remove(c)"><mat-icon>delete</mat-icon></button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <div *ngIf="!categories.length" style="margin-top:12px;">Không có dữ liệu</div>
  </div>
  `,
})
export class QuanLyDanhMucComponent implements OnInit {
  categories: Category[] = [];
  displayedColumns = ['name', 'description', 'actions'];
  newName = '';
  newDesc = '';

  constructor(private productService: ProductService) {}

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.categories = await this.productService.listCategories();
  }

  async create(): Promise<void> {
    if (!this.newName.trim()) return;
    await this.productService.createCategory({ name: this.newName.trim(), description: this.newDesc || '', createdAt: new Date() } as any);
    this.newName = '';
    this.newDesc = '';
    await this.reload();
  }

  async remove(c: Category): Promise<void> {
    await this.productService.deleteCategory(c.id);
    await this.reload();
  }
}


