import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-quan-ly-user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="quan-ly-user-container">
      <h1>Quản lý Người dùng</h1>
      <p>Chức năng quản lý người dùng đã được chuyển sang trang mới.</p>
      <a routerLink="/user-management" class="btn btn-primary">
        Truy cập Quản lý Người dùng
      </a>
    </div>
  `,
  styles: [`
    .quan-ly-user-container {
      padding: 20px;
      text-align: center;
    }
    
    .btn {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 20px;
    }
    
    .btn:hover {
      background-color: #0056b3;
    }
  `]
})
export class QuanLyUserComponent {
  // Component đã được đơn giản hóa
}
