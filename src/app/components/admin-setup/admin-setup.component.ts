import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-admin-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-setup">
      <h1>Thiết lập Admin</h1>
      
      <div class="setup-info">
        <h2>⚠️ Lưu ý quan trọng:</h2>
        <p>Để sử dụng chức năng quản lý người dùng, bạn cần có ít nhất một tài khoản admin trong hệ thống.</p>
        
        <div class="warning">
          <h3>🔒 Vấn đề hiện tại:</h3>
          <ul>
            <li>Firestore rules yêu cầu admin role để tạo user mới</li>
            <li>Nhưng chưa có admin nào trong database</li>
            <li>Cần tạo admin user đầu tiên thủ công</li>
          </ul>
        </div>
        
        <div class="solution">
          <h3>💡 Giải pháp:</h3>
          <ol>
            <li>Tạo admin user đầu tiên bằng cách sửa Firestore rules tạm thời</li>
            <li>Hoặc tạo admin user trực tiếp trong Firebase Console</li>
            <li>Sau đó có thể sử dụng chức năng quản lý người dùng bình thường</li>
          </ol>
        </div>
        
        <div class="manual-steps">
          <h3>📋 Các bước thực hiện:</h3>
          <div class="step">
            <h4>Bước 1: Tạo admin user trong Firebase Console</h4>
            <ol>
              <li>Truy cập <a href="https://console.firebase.google.com/project/vattuchinhhang-c5952/firestore" target="_blank">Firebase Console</a></li>
              <li>Vào Firestore Database</li>
              <li>Tạo collection "users"</li>
              <li>Thêm document với ID là UID của bạn</li>
              <li>Thêm các field:
                <pre>
{{ '{' }}
  "name": "Admin User",
  "email": "admin@example.com", 
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00Z"
{{ '}' }}
                </pre>
              </li>
            </ol>
          </div>
          
          <div class="step">
            <h4>Bước 2: Test chức năng</h4>
            <ol>
              <li>Refresh trang web</li>
              <li>Thử tạo user mới</li>
              <li>Kiểm tra xem có hoạt động không</li>
            </ol>
          </div>
        </div>
        
        <div class="alternative">
          <h3>🔄 Cách khác: Sửa rules tạm thời</h3>
          <p>Nếu muốn tạo admin user từ ứng dụng, có thể sửa firestore.rules tạm thời:</p>
          <pre>
// Thay đổi dòng này trong firestore.rules:
allow create: if request.auth != null; // Cho phép tất cả user đã đăng nhập tạo user
          </pre>
          <p>Sau khi tạo admin user đầu tiên, nhớ đổi lại rules như cũ.</p>
        </div>
      </div>
      
      <div class="actions">
        <button (click)="refreshPage()" class="btn btn-primary">
          🔄 Refresh trang
        </button>
        <a href="https://console.firebase.google.com/project/vattuchinhhang-c5952/firestore" target="_blank" class="btn btn-secondary">
          🔗 Mở Firebase Console
        </a>
      </div>
    </div>
  `,
  styles: [`
    .admin-setup {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .setup-info {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    
    .setup-info h2 {
      color: #dc3545;
      margin-top: 0;
    }
    
    .warning {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
    
    .warning h3 {
      color: #721c24;
      margin-top: 0;
    }
    
    .solution {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
    
    .solution h3 {
      color: #155724;
      margin-top: 0;
    }
    
    .manual-steps {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
    
    .step {
      margin: 20px 0;
    }
    
    .step h4 {
      color: #333;
      margin-bottom: 10px;
    }
    
    .step ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    
    .step li {
      margin: 5px 0;
    }
    
    .step pre {
      background: #e9ecef;
      padding: 10px;
      border-radius: 4px;
      font-size: 12px;
      margin: 10px 0;
    }
    
    .alternative {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
    
    .alternative h3 {
      color: #856404;
      margin-top: 0;
    }
    
    .alternative pre {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      font-size: 14px;
      margin: 10px 0;
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
      border: none;
      cursor: pointer;
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
export class AdminSetupComponent implements OnInit {
  constructor(
    @Inject(UsersService) private usersService: UsersService
  ) {}

  ngOnInit() {
    // Component setup admin
  }

  refreshPage() {
    window.location.reload();
  }
}
