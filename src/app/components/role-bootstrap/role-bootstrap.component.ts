import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RolesService } from '../../services/roles.service';
import { AuthService } from '../../services/auth.service';
import { UserRole, ROLE_DISPLAY_NAMES } from '../../models/user.model';

@Component({
  selector: 'app-role-bootstrap',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <mat-card class="bootstrap-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>admin_panel_settings</mat-icon>
            Thiết lập Super Admin đầu tiên
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div class="setup-info">
            <h3>🎯 Thiết lập hệ thống roles động</h3>
            <p>Để sử dụng hệ thống quản lý vai trò động, bạn cần tạo Super Admin đầu tiên.</p>
            
            <div class="current-user-info" *ngIf="currentUser">
              <h4>Thông tin người dùng hiện tại:</h4>
              <div class="user-details">
                <p><strong>Email:</strong> {{ currentUser.email }}</p>
                <p><strong>Tên:</strong> {{ currentUser.fullName }}</p>
                <p><strong>Vai trò hiện tại:</strong> 
                  <mat-chip [class]="'role-chip-' + currentUser.role">
                    {{ getRoleDisplayName(currentUser.role) }}
                  </mat-chip>
                </p>
              </div>
            </div>

            <div class="bootstrap-form" *ngIf="!isLoading">
              <h4>Gán vai trò Super Admin:</h4>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email người dùng</mat-label>
                <input matInput [(ngModel)]="bootstrapData.email" placeholder="user@example.com">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Lý do (tùy chọn)</mat-label>
                <textarea matInput [(ngModel)]="bootstrapData.reason" rows="3" placeholder="Lý do tạo Super Admin đầu tiên..."></textarea>
              </mat-form-field>

              <div class="action-buttons">
                <button mat-raised-button color="primary" (click)="bootstrapSuperAdmin()" [disabled]="!bootstrapData.email">
                  <mat-icon>admin_panel_settings</mat-icon>
                  Tạo Super Admin đầu tiên
                </button>
                
                <button mat-raised-button color="accent" (click)="skipSetup()">
                  <mat-icon>skip_next</mat-icon>
                  Bỏ qua thiết lập
                </button>
              </div>
            </div>

            <div class="loading-section" *ngIf="isLoading">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Đang thiết lập Super Admin...</p>
            </div>
          </div>

          <div class="help-section">
            <h4>📋 Hướng dẫn:</h4>
            <ol>
              <li>Nhập email của người dùng sẽ trở thành Super Admin</li>
              <li>Nhập lý do tạo Super Admin (tùy chọn)</li>
              <li>Click "Tạo Super Admin đầu tiên"</li>
              <li>Sau khi tạo thành công, bạn có thể quản lý roles trong Role Management</li>
            </ol>
          </div>

          <div class="warning-section">
            <h4>⚠️ Lưu ý quan trọng:</h4>
            <ul>
              <li>Chỉ có thể tạo Super Admin đầu tiên một lần</li>
              <li>Super Admin có quyền cao nhất trong hệ thống</li>
              <li>Sau khi tạo, bạn có thể gán roles cho người khác</li>
              <li>Nếu bỏ qua, hệ thống sẽ sử dụng roles từ collection <code>users</code></li>
            </ul>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .bootstrap-card {
      margin-bottom: 20px;
    }

    .setup-info, .help-section, .warning-section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }

    .current-user-info {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .user-details p {
      margin: 8px 0;
    }

    .role-chip-super_admin {
      background-color: #ff6b35;
      color: white;
    }

    .role-chip-admin {
      background-color: #4caf50;
      color: white;
    }

    .role-chip-seller {
      background-color: #2196f3;
      color: white;
    }

    .role-chip-customer {
      background-color: #9e9e9e;
      color: white;
    }

    .bootstrap-form {
      margin: 20px 0;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      margin-top: 20px;
    }

    .loading-section {
      text-align: center;
      padding: 40px;
    }

    .loading-section p {
      margin-top: 16px;
      color: #666;
    }

    .help-section {
      background: #e3f2fd;
    }

    .warning-section {
      background: #fff3e0;
    }

    .help-section ol, .warning-section ul {
      margin: 0;
      padding-left: 20px;
    }

    .help-section li, .warning-section li {
      margin: 8px 0;
    }

    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
    }

    h3, h4 {
      margin-top: 0;
      color: #333;
    }

    p {
      line-height: 1.6;
    }
  `]
})
export class RoleBootstrapComponent implements OnInit {
  currentUser: any = null;
  isLoading = false;
  
  bootstrapData = {
    email: '',
    reason: ''
  };

  ROLE_DISPLAY_NAMES = ROLE_DISPLAY_NAMES;

  constructor(
    private rolesService: RolesService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.preFillEmail();
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  preFillEmail(): void {
    if (this.currentUser && this.currentUser.email) {
      this.bootstrapData.email = this.currentUser.email;
    }
  }

  async bootstrapSuperAdmin(): Promise<void> {
    if (!this.bootstrapData.email) {
      this.snackBar.open('Vui lòng nhập email', 'Đóng', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    try {
      // Create super admin user and role assignment
      await this.rolesService.bootstrapFirstSuperAdmin(
        this.bootstrapData.email,
        this.bootstrapData.reason || 'Bootstrap first super admin'
      );

      this.snackBar.open('Super Admin đầu tiên đã được tạo thành công!', 'Đóng', { duration: 5000 });
      
      // Redirect to role management
      setTimeout(() => {
        this.router.navigate(['/role-management']);
      }, 2000);

    } catch (error) {
      this.snackBar.open('Lỗi khi tạo Super Admin: ' + (error as Error).message, 'Đóng', { duration: 5000 });
    } finally {
      this.isLoading = false;
    }
  }

  skipSetup(): void {
    this.snackBar.open('Đã bỏ qua thiết lập. Hệ thống sẽ sử dụng roles từ collection users.', 'Đóng', { duration: 3000 });
    this.router.navigate(['/dashboard']);
  }

  getRoleDisplayName(role: string): string {
    return ROLE_DISPLAY_NAMES[role as UserRole] || role;
  }
}
