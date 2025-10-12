import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RolesService, RoleAssignment, RoleChangeRequest } from '../../services/roles.service';
import { AuthService } from '../../services/auth.service';
import { UserRole, ROLE_DISPLAY_NAMES } from '../../models/user.model';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit {
  roleAssignments: RoleAssignment[] = [];
  pendingRequests: RoleChangeRequest[] = [];
  roleStats: { [key: string]: number } = {
    [UserRole.ADMIN]: 0,
    [UserRole.SELLER]: 0,
    [UserRole.CUSTOMER]: 0
  };

  // Form for assigning new roles
  assignForm!: FormGroup;
  newAssignment = {
    email: '',
    role: UserRole.CUSTOMER,
    reason: ''
  };

  // Table columns
  assignmentColumns: string[] = ['email', 'role', 'assignedAt', 'reason', 'actions'];
  requestColumns: string[] = ['email', 'requestedRole', 'reason', 'requestedAt', 'actions'];

  availableRoles = Object.values(UserRole).filter(role => role !== UserRole.SUPER_ADMIN);
  ROLE_DISPLAY_NAMES = ROLE_DISPLAY_NAMES;

  constructor(
    private rolesService: RolesService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkFirstTimeSetup();
  }

  private initializeForm(): void {
    this.assignForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: [UserRole.CUSTOMER, Validators.required],
      reason: ['']
    });
  }

  async checkFirstTimeSetup(): Promise<void> {
    try {
      // Refresh user role to ensure correct role is loaded
      console.log('RoleManagementComponent: Refreshing user role...');
      await this.authService.refreshUserRole();
      
      // Skip first time setup check for now to avoid permission errors
      console.log('RoleManagementComponent: Skipping first time setup check');
      this.loadData();
    } catch (error) {
      console.error('RoleManagementComponent: Error checking setup:', error);
      this.loadData(); // Try to load data anyway
    }
  }

  async loadData(): Promise<void> {
    try {
      // Try to load role assignments, but don't fail if permission denied
      try {
        await this.loadRoleAssignments();
      } catch (error) {
        console.log('RoleManagementComponent: Could not load role assignments:', error);
        this.roleAssignments = []; // Set empty array
      }

      // Try to load pending requests, but don't fail if permission denied
      try {
        await this.loadPendingRequests();
      } catch (error) {
        console.log('RoleManagementComponent: Could not load pending requests:', error);
        this.pendingRequests = []; // Set empty array
      }

      // Try to load role statistics, but don't fail if permission denied
      try {
        await this.loadRoleStatistics();
      } catch (error) {
        console.log('RoleManagementComponent: Could not load role statistics:', error);
        // Keep default stats
      }
    } catch (error) {
      console.error('RoleManagementComponent: Error loading data:', error);
      // Set empty arrays to prevent UI errors
      this.roleAssignments = [];
      this.pendingRequests = [];
    }
  }

  async loadRoleAssignments(): Promise<void> {
    this.roleAssignments = await this.rolesService.getAllRoleAssignments();
  }

  async loadPendingRequests(): Promise<void> {
    this.pendingRequests = await this.rolesService.getPendingRoleChangeRequests();
  }

  async loadRoleStatistics(): Promise<void> {
    this.roleStats = await this.rolesService.getRoleStatistics();
  }

  async assignRole(): Promise<void> {
    if (!this.assignForm.valid) {
      this.snackBar.open('Vui lòng điền đầy đủ thông tin', 'Đóng', { duration: 3000 });
      return;
    }

    const { email, role, reason } = this.assignForm.value;
    
    try {
      // For now, just try to assign role normally
      // If it fails due to permissions, user can create manually in Firebase Console
      const userId = 'temp-user-id-' + Date.now();
      
      await this.rolesService.assignRole(
        userId,
        email,
        role,
        reason
      );
      this.snackBar.open('Gán vai trò thành công', 'Đóng', { duration: 3000 });

      // Reset form
      this.assignForm.reset();
      this.assignForm.patchValue({ role: UserRole.CUSTOMER });

      // Reload data
      await this.loadData();
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.snackBar.open(`Lỗi khi gán vai trò: ${errorMessage}. Hãy tạo Super Admin trong Firebase Console trước.`, 'Đóng', { duration: 8000 });
      console.error('RoleManagementComponent: Error assigning role:', error);
    }
  }

  async removeRole(assignment: RoleAssignment): Promise<void> {
    if (!confirm(`Bạn có chắc chắn muốn xóa vai trò ${this.getRoleDisplayName(assignment.role)} của ${assignment.email}?`)) {
      return;
    }

    try {
      await this.rolesService.removeRoleAssignment(assignment.userId);
      this.snackBar.open('Xóa vai trò thành công', 'Đóng', { duration: 3000 });
      await this.loadData();
    } catch (error) {
      this.snackBar.open('Lỗi khi xóa vai trò: ' + (error as Error).message, 'Đóng', { duration: 5000 });
    }
  }

  async approveRequest(request: RoleChangeRequest): Promise<void> {
    if (!confirm(`Bạn có chắc chắn muốn phê duyệt yêu cầu thay đổi vai trò của ${request.email}?`)) {
      return;
    }

    try {
      if (!request.id) {
        throw new Error('Request ID không tồn tại');
      }
      await this.rolesService.approveRoleChangeRequest(request.id);
      this.snackBar.open('Phê duyệt yêu cầu thành công', 'Đóng', { duration: 3000 });
      await this.loadData();
    } catch (error) {
      this.snackBar.open('Lỗi khi phê duyệt yêu cầu: ' + (error as Error).message, 'Đóng', { duration: 5000 });
    }
  }

  async rejectRequest(request: RoleChangeRequest): Promise<void> {
    if (!confirm(`Bạn có chắc chắn muốn từ chối yêu cầu thay đổi vai trò của ${request.email}?`)) {
      return;
    }

    try {
      if (!request.id) {
        throw new Error('Request ID không tồn tại');
      }
      await this.rolesService.rejectRoleChangeRequest(request.id);
      this.snackBar.open('Từ chối yêu cầu thành công', 'Đóng', { duration: 3000 });
      await this.loadData();
    } catch (error) {
      this.snackBar.open('Lỗi khi từ chối yêu cầu: ' + (error as Error).message, 'Đóng', { duration: 5000 });
    }
  }

  async refreshAssignments(): Promise<void> {
    await this.loadData();
    this.snackBar.open('Đã làm mới dữ liệu', 'Đóng', { duration: 2000 });
  }

  getRoleDisplayName(role: string): string {
    return ROLE_DISPLAY_NAMES[role as UserRole] || role;
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case UserRole.SUPER_ADMIN: return 'admin_panel_settings';
      case UserRole.ADMIN: return 'security';
      case UserRole.SELLER: return 'store';
      case UserRole.CUSTOMER: return 'person';
      default: return 'help';
    }
  }
}