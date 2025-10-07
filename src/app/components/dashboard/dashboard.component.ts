import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  stats = [
    {
      title: 'Tổng sản phẩm',
      value: '1,234',
      icon: 'inventory',
      color: 'primary',
      change: '+12%'
    },
    {
      title: 'Đơn hàng hôm nay',
      value: '56',
      icon: 'shopping_cart',
      color: 'accent',
      change: '+8%'
    },
    {
      title: 'Khách hàng',
      value: '789',
      icon: 'people',
      color: 'warn',
      change: '+15%'
    },
    {
      title: 'Doanh thu tháng',
      value: '45.2M',
      icon: 'attach_money',
      color: 'primary',
      change: '+23%'
    }
  ];

  recentActivities = [
    { action: 'Đơn hàng mới', detail: 'Đơn hàng #12345', time: '2 phút trước', icon: 'add_shopping_cart' },
    { action: 'Sản phẩm cập nhật', detail: 'iPhone 15 Pro Max', time: '15 phút trước', icon: 'update' },
    { action: 'Khách hàng mới', detail: 'Nguyễn Văn A', time: '1 giờ trước', icon: 'person_add' },
    { action: 'Thanh toán', detail: 'Đơn hàng #12340', time: '2 giờ trước', icon: 'payment' }
  ];
}
