import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private authService: AuthService) {}

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

  logout(): void {
    console.log('Dashboard: Logout button clicked');
    this.authService.logout();
  }

  getCurrentUser(): string {
    const user = this.authService.getCurrentUser();
    return user?.fullName || user?.email || 'User';
  }

  getUserRole(): UserRole | null {
    const user = this.authService.getCurrentUser();
    return user?.role || null;
  }

  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  canManageUsers(): boolean {
    return this.authService.canManageUsers();
  }

  getRoleDisplayName(): string {
    const role = this.getUserRole();
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'Siêu quản trị viên';
      case UserRole.ADMIN:
        return 'Quản trị viên';
      case UserRole.SELLER:
        return 'Người bán';
      case UserRole.CUSTOMER:
        return 'Khách hàng';
      default:
        return 'Người dùng';
    }
  }

  getRoleColor(): string {
    const role = this.getUserRole();
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'warn';
      case UserRole.ADMIN:
        return 'primary';
      case UserRole.SELLER:
        return 'accent';
      case UserRole.CUSTOMER:
        return 'basic';
      default:
        return 'basic';
    }
  }
}
