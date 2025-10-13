import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/product.model';

@Component({
  selector: 'app-quan-ly-don-hang',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule],
  template: `
  <div class="p-4">
    <h2>Quản lý đơn hàng</h2>
    <div style="display:flex; gap:12px; align-items:center; margin: 12px 0;">
      <mat-form-field appearance="outline">
        <mat-label>Customer ID</mat-label>
        <input matInput [(ngModel)]="customerId" placeholder="Nhập customerId" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Trạng thái</mat-label>
        <mat-select [(ngModel)]="status">
          <mat-option [value]="undefined">Tất cả</mat-option>
          <mat-option value="pending">pending</mat-option>
          <mat-option value="paid">paid</mat-option>
          <mat-option value="shipping">shipping</mat-option>
          <mat-option value="completed">completed</mat-option>
          <mat-option value="cancelled">cancelled</mat-option>
        </mat-select>
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="reload()">Tải</button>
    </div>
    <table mat-table [dataSource]="orders" class="mat-elevation-z1" *ngIf="orders.length">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>Mã đơn</th>
        <td mat-cell *matCellDef="let o">{{ o.id }}</td>
      </ng-container>
      <ng-container matColumnDef="items">
        <th mat-header-cell *matHeaderCellDef>Số SP</th>
        <td mat-cell *matCellDef="let o">{{ o.items.length }}</td>
      </ng-container>
      <ng-container matColumnDef="total">
        <th mat-header-cell *matHeaderCellDef>Tổng</th>
        <td mat-cell *matCellDef="let o">{{ o.total | number }}</td>
      </ng-container>
      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Trạng thái</th>
        <td mat-cell *matCellDef="let o">{{ o.status }}</td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <div *ngIf="!orders.length" style="margin-top:12px;">Không có dữ liệu</div>
  </div>
  `,
})
export class QuanLyDonHangComponent {
  orders: Order[] = [];
  displayedColumns = ['id', 'items', 'total', 'status'];
  customerId = '';
  status: OrderStatus | undefined = undefined;

  constructor(private orderService: OrderService) {}

  async reload(): Promise<void> {
    if (!this.customerId) { this.orders = []; return; }
    this.orders = await this.orderService.listOrdersByCustomer(this.customerId, this.status);
  }
}


