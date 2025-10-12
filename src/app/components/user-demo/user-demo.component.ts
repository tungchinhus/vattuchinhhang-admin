import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-user-demo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="user-demo">
      <h1>Demo Quản lý Người dùng</h1>
      
      <div class="demo-info">
        <h2>Chức năng đã được tạo:</h2>
        <ul>
          <li>✅ Giao diện quản lý người dùng đầy đủ</li>
          <li>✅ Thêm/Sửa/Xóa người dùng</li>
          <li>✅ Upload avatar</li>
          <li>✅ Tìm kiếm và lọc theo vai trò</li>
          <li>✅ Phân trang</li>
          <li>✅ Validation form</li>
          <li>✅ Giao diện responsive</li>
        </ul>
        
        <h2>Các vai trò người dùng:</h2>
        <ul>
          <li>👤 <strong>Customer</strong> - Khách hàng</li>
          <li>🏪 <strong>Seller</strong> - Người bán</li>
          <li>👑 <strong>Admin</strong> - Quản trị viên</li>
        </ul>
        
        <div class="features">
          <h2>Tính năng chính:</h2>
          <div class="feature-grid">
            <div class="feature-item">
              <h3>📋 Danh sách người dùng</h3>
              <p>Hiển thị danh sách người dùng với thông tin đầy đủ</p>
            </div>
            <div class="feature-item">
              <h3>🔍 Tìm kiếm</h3>
              <p>Tìm kiếm theo tên hoặc email</p>
            </div>
            <div class="feature-item">
              <h3>🏷️ Lọc theo vai trò</h3>
              <p>Lọc người dùng theo vai trò</p>
            </div>
            <div class="feature-item">
              <h3>➕ Thêm người dùng</h3>
              <p>Form thêm người dùng mới với validation</p>
            </div>
            <div class="feature-item">
              <h3>✏️ Sửa người dùng</h3>
              <p>Chỉnh sửa thông tin người dùng</p>
            </div>
            <div class="feature-item">
              <h3>🗑️ Xóa người dùng</h3>
              <p>Xóa người dùng với xác nhận</p>
            </div>
            <div class="feature-item">
              <h3>📷 Upload Avatar</h3>
              <p>Upload và preview ảnh đại diện</p>
            </div>
            <div class="feature-item">
              <h3>📄 Phân trang</h3>
              <p>Phân trang danh sách người dùng</p>
            </div>
          </div>
        </div>
        
        <div class="note">
          <h3>Lưu ý:</h3>
          <p>Tất cả dữ liệu được lưu trữ trên Firebase Firestore và Firebase Storage. 
          Chức năng đã được tích hợp đầy đủ với authentication và authorization.</p>
        </div>
      </div>
      
      <div class="actions">
        <a routerLink="/user-management" class="btn btn-primary">
          🚀 Truy cập Quản lý Người dùng
        </a>
        <a routerLink="/dashboard" class="btn btn-secondary">
          ← Quay lại Dashboard
        </a>
      </div>
    </div>
  `,
  styles: [`
    .user-demo {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .demo-info {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    
    .demo-info h2 {
      color: #333;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
      margin-top: 30px;
    }
    
    .demo-info h2:first-child {
      margin-top: 0;
    }
    
    .demo-info ul {
      margin: 15px 0;
      padding-left: 20px;
    }
    
    .demo-info li {
      margin: 8px 0;
      color: #555;
    }
    
    .features {
      margin-top: 30px;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .feature-item {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 6px;
      border-left: 4px solid #007bff;
    }
    
    .feature-item h3 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 16px;
    }
    
    .feature-item p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
    
    .note {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      padding: 20px;
      border-radius: 4px;
      margin-top: 20px;
    }
    
    .note h3 {
      color: #856404;
      margin-top: 0;
    }
    
    .note p {
      color: #856404;
      margin: 0;
    }
    
    .actions {
      text-align: center;
      display: flex;
      gap: 15px;
      justify-content: center;
    }
    
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s;
      font-weight: 500;
    }
    
    .btn:hover {
      background-color: #0056b3;
    }
    
    .btn-secondary {
      background-color: #6c757d;
    }
    
    .btn-secondary:hover {
      background-color: #545b62;
    }
  `]
})
export class UserDemoComponent implements OnInit {
  constructor(
    @Inject(UsersService) private usersService: UsersService
  ) {}

  ngOnInit() {
    // Component demo đã được tạo
  }
}