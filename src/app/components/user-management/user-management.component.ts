import { Component, OnInit, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { ImageUploadService } from '../../services/image-upload.service';
import { User, UserFormData, UserRole, ROLE_DISPLAY_NAMES } from '../../models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-management">
      <div class="header">
        <h1>Quản lý Người dùng</h1>
        <button (click)="openAddDialog()" class="btn btn-primary">
          <i class="icon">+</i>
          Thêm người dùng
        </button>
      </div>

      <!-- Search and Filter -->
      <div class="search-filter">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (input)="onSearchChange()"
            placeholder="Tìm kiếm theo tên hoặc email..."
            class="search-input">
          <i class="search-icon">🔍</i>
        </div>
        
        <div class="filter-box">
          <select [(ngModel)]="selectedRole" (change)="onFilterChange()" class="filter-select">
            <option value="">Tất cả vai trò</option>
            <option *ngFor="let role of userRoles" [value]="role">
              {{ ROLE_DISPLAY_NAMES[role] }}
            </option>
          </select>
        </div>
        
        <button (click)="clearFilters()" class="btn btn-secondary">
          Xóa bộ lọc
        </button>
      </div>

      <!-- Users Table -->
      <div class="table-container">
        <div class="table-header">
          <div class="col-name">Tên</div>
          <div class="col-email">Email</div>
          <div class="col-role">Vai trò</div>
          <div class="col-avatar">Ảnh đại diện</div>
          <div class="col-created">Ngày tạo</div>
          <div class="col-actions">Thao tác</div>
        </div>
        
        <div class="table-body">
          <div *ngIf="isLoading()" class="loading">
            <div class="spinner"></div>
            <span>Đang tải...</span>
          </div>
          
          <div *ngIf="!isLoading() && filteredUsers().length === 0" class="no-data">
            <i class="icon">👥</i>
            <p>Không có người dùng nào</p>
          </div>
          
          <div *ngFor="let user of paginatedUsers()" class="table-row">
            <div class="col-name">
              <div class="user-info">
                <div class="user-name">{{ user.name }}</div>
              </div>
            </div>
            
            <div class="col-email">
              <span class="email">{{ user.email }}</span>
            </div>
            
            <div class="col-role">
              <span class="role-badge" [class]="'role-' + user.role">
                {{ ROLE_DISPLAY_NAMES[user.role] }}
              </span>
            </div>
            
            <div class="col-avatar">
              <div class="avatar-container">
                <img 
                  *ngIf="user.avatarUrl" 
                  [src]="user.avatarUrl" 
                  [alt]="user.name"
                  class="avatar">
                <div *ngIf="!user.avatarUrl" class="avatar-placeholder">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
              </div>
            </div>
            
            <div class="col-created">
              <span class="created-date">{{ formatDate(user.createdAt) }}</span>
            </div>
            
            <div class="col-actions">
              <button (click)="editUser(user)" class="btn btn-sm btn-primary">
                <i class="icon">✏️</i>
                Sửa
              </button>
              <button (click)="deleteUser(user)" class="btn btn-sm btn-danger">
                <i class="icon">🗑️</i>
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="totalPages > 1">
        <button 
          (click)="goToPage(currentPage - 1)" 
          [disabled]="currentPage === 1"
          class="btn btn-sm">
          ← Trước
        </button>
        
        <span class="page-info">
          Trang {{ currentPage }} / {{ totalPages }}
        </span>
        
        <button 
          (click)="goToPage(currentPage + 1)" 
          [disabled]="currentPage === totalPages"
          class="btn btn-sm">
          Sau →
        </button>
      </div>

      <!-- Add/Edit Dialog -->
      <div *ngIf="isDialogOpen()" class="dialog-overlay" (click)="closeDialog()">
        <div class="dialog" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h3>{{ isEditMode() ? 'Sửa người dùng' : 'Thêm người dùng' }}</h3>
            <button (click)="closeDialog()" class="close-btn">×</button>
          </div>
          
          <div class="dialog-body">
            <form (ngSubmit)="saveUser()" #userForm="ngForm" class="user-form">
              <div class="form-group">
                <label for="name">Tên người dùng *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  [(ngModel)]="formData.name" 
                  required 
                  class="form-control"
                  placeholder="Nhập tên người dùng">
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  [(ngModel)]="formData.email" 
                  required 
                  email
                  class="form-control"
                  placeholder="Nhập email">
              </div>

              <div class="form-group">
                <label for="role">Vai trò *</label>
                <select 
                  id="role" 
                  name="role" 
                  [(ngModel)]="formData.role" 
                  required 
                  class="form-control">
                  <option value="">Chọn vai trò</option>
                  <option *ngFor="let role of userRoles" [value]="role">
                    {{ ROLE_DISPLAY_NAMES[role] }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="avatar">Ảnh đại diện</label>
                <input 
                  type="file" 
                  id="avatar" 
                  name="avatar" 
                  (change)="onAvatarChange($event)"
                  accept="image/*"
                  class="form-control">
                <div *ngIf="formData.avatarUrl" class="avatar-preview">
                  <img [src]="formData.avatarUrl" alt="Avatar preview" class="preview-image">
                  <button type="button" (click)="removeAvatar()" class="remove-avatar">×</button>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" (click)="closeDialog()" class="btn btn-secondary">
                  Hủy
                </button>
                <button type="submit" [disabled]="!userForm.form.valid || isSaving()" class="btn btn-primary">
                  {{ isSaving() ? 'Đang lưu...' : (isEditMode() ? 'Cập nhật' : 'Thêm') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-management {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e9ecef;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .search-filter {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      align-items: center;
    }

    .search-box {
      position: relative;
      flex: 1;
    }

    .search-input {
      width: 100%;
      padding: 10px 40px 10px 15px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }

    .search-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }

    .filter-box {
      min-width: 200px;
    }

    .filter-select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .table-header {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1.5fr;
      gap: 15px;
      padding: 15px 20px;
      background: #f8f9fa;
      font-weight: 600;
      color: #333;
      border-bottom: 1px solid #e9ecef;
    }

    .table-body {
      min-height: 200px;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1.5fr;
      gap: 15px;
      padding: 15px 20px;
      border-bottom: 1px solid #f0f0f0;
      align-items: center;
      transition: background-color 0.2s;
    }

    .table-row:hover {
      background-color: #f8f9fa;
    }

    .user-name {
      font-weight: 500;
      color: #333;
    }

    .email {
      color: #666;
      font-size: 14px;
    }

    .role-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
    }

    .role-seller {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .role-admin {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .role-customer {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .avatar-container {
      display: flex;
      justify-content: center;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e9ecef;
    }

    .avatar-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #007bff;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 16px;
    }

    .created-date {
      color: #666;
      font-size: 14px;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #666;
    }

    .spinner {
      width: 30px;
      height: 30px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 10px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #666;
    }

    .no-data .icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
      margin-top: 20px;
    }

    .page-info {
      color: #666;
      font-size: 14px;
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e9ecef;
    }

    .dialog-header h3 {
      margin: 0;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: #333;
    }

    .dialog-body {
      padding: 20px;
    }

    .user-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 5px;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .avatar-preview {
      position: relative;
      margin-top: 10px;
      display: inline-block;
    }

    .preview-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 50%;
      border: 2px solid #ddd;
    }

    .remove-avatar {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #dc3545;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
    }

    .icon {
      font-style: normal;
    }
  `]
})
export class UserManagementComponent implements OnInit {
  // Data
  users = signal<User[]>([]);
  filteredUsers = signal<User[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);

  // Dialog state
  isDialogOpen = signal(false);
  isEditMode = signal(false);
  currentUser: User | null = null;

  // Form data
  formData: UserFormData = {
    name: '',
    email: '',
    role: UserRole.CUSTOMER,
    avatarUrl: ''
  };

  // Search and filter
  searchTerm = '';
  selectedRole = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  // Enums
  userRoles = Object.values(UserRole);
  ROLE_DISPLAY_NAMES = ROLE_DISPLAY_NAMES;

  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(ImageUploadService) private imageUploadService: ImageUploadService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      this.isLoading.set(true);
      const users = await this.usersService.getUsers();
      this.users.set(users);
      this.applyFilters();
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Không thể tải danh sách người dùng');
    } finally {
      this.isLoading.set(false);
    }
  }

  applyFilters() {
    let filtered = [...this.users()];

    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }

    // Role filter
    if (this.selectedRole) {
      filtered = filtered.filter(user => user.role === this.selectedRole);
    }

    this.filteredUsers.set(filtered);
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers().length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
  }

  paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredUsers().slice(start, end);
  }

  onSearchChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedRole = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openAddDialog() {
    this.isEditMode.set(false);
    this.currentUser = null;
    this.formData = {
      name: '',
      email: '',
      role: UserRole.CUSTOMER,
      avatarUrl: ''
    };
    this.isDialogOpen.set(true);
  }

  editUser(user: User) {
    this.isEditMode.set(true);
    this.currentUser = user;
    this.formData = {
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl || ''
    };
    this.isDialogOpen.set(true);
  }

  closeDialog() {
    this.isDialogOpen.set(false);
    this.currentUser = null;
    this.formData = {
      name: '',
      email: '',
      role: UserRole.CUSTOMER,
      avatarUrl: ''
    };
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData.avatarUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar() {
    this.formData.avatarUrl = '';
  }

  async saveUser() {
    if (!this.formData.name || !this.formData.email || !this.formData.role) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      this.isSaving.set(true);

      if (this.isEditMode() && this.currentUser) {
        // Update existing user
        await this.usersService.updateUser(this.currentUser.id, this.formData);
        
        // Update local data
        const updatedUsers = this.users().map(user =>
          user.id === this.currentUser!.id
            ? { ...user, ...this.formData }
            : user
        );
        this.users.set(updatedUsers);
        
        alert('Cập nhật người dùng thành công!');
      } else {
        // Add new user
        const userId = await this.usersService.addUser(this.formData);
        
        // Add to local data
        const newUser: User = {
          id: userId,
          ...this.formData,
          createdAt: new Date()
        };
        this.users.set([...this.users(), newUser]);
        
        alert('Thêm người dùng thành công!');
      }

      this.applyFilters();
      this.closeDialog();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Không thể lưu người dùng. Vui lòng thử lại!');
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteUser(user: User) {
    if (!confirm(`Bạn có chắc muốn xóa người dùng "${user.name}"?`)) {
      return;
    }

    try {
      await this.usersService.deleteUser(user.id);
      
      // Remove from local data
      const updatedUsers = this.users().filter(u => u.id !== user.id);
      this.users.set(updatedUsers);
      
      this.applyFilters();
      alert('Xóa người dùng thành công!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Không thể xóa người dùng. Vui lòng thử lại!');
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('vi-VN');
  }
}
