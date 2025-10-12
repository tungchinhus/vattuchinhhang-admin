import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-role-persistence-test',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card class="test-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>bug_report</mat-icon>
            Role Persistence Test
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div class="user-info">
            <h3>Current User Info:</h3>
            <div *ngIf="currentUser; else noUser">
              <p><strong>ID:</strong> {{ currentUser.id }}</p>
              <p><strong>Email:</strong> {{ currentUser.email }}</p>
              <p><strong>Name:</strong> {{ currentUser.fullName }}</p>
              <p><strong>Role:</strong> 
                <span [class]="'role-' + currentUser.role.toLowerCase()">
                  {{ currentUser.role }}
                </span>
              </p>
              <p><strong>Avatar:</strong> {{ currentUser.avatarUrl || 'None' }}</p>
            </div>
            <ng-template #noUser>
              <p>No user logged in</p>
            </ng-template>
          </div>

          <div class="test-actions">
            <h3>Test Actions:</h3>
            <div class="button-group">
              <button mat-raised-button color="primary" (click)="refreshUserData()">
                <mat-icon>refresh</mat-icon>
                Refresh User Data
              </button>
              
              <button mat-raised-button color="accent" (click)="forceReloadUser()">
                <mat-icon>replay</mat-icon>
                Force Reload User
              </button>
              
              <button mat-raised-button color="warn" (click)="clearStorage()">
                <mat-icon>clear</mat-icon>
                Clear Storage
              </button>
              
              <button mat-raised-button (click)="reloadPage()">
                <mat-icon>refresh</mat-icon>
                Reload Page
              </button>
            </div>
          </div>

          <div class="storage-info">
            <h3>Storage Info:</h3>
            <p><strong>localStorage currentUser:</strong></p>
            <pre>{{ storageInfo }}</pre>
          </div>

          <div class="role-tests">
            <h3>Role Tests:</h3>
            <div class="role-checks">
              <p>Is Super Admin: <span [class]="authService.isSuperAdmin() ? 'success' : 'error'">{{ authService.isSuperAdmin() }}</span></p>
              <p>Is Admin: <span [class]="authService.isAdmin() ? 'success' : 'error'">{{ authService.isAdmin() }}</span></p>
              <p>Can Manage Users: <span [class]="authService.canManageUsers() ? 'success' : 'error'">{{ authService.canManageUsers() }}</span></p>
            </div>
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

    .test-card {
      margin-bottom: 20px;
    }

    .user-info, .test-actions, .storage-info, .role-tests {
      margin-bottom: 20px;
      padding: 15px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }

    .button-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .button-group button {
      margin: 5px 0;
    }

    .role-super_admin {
      color: #ff6b35;
      font-weight: bold;
    }

    .role-admin {
      color: #4caf50;
      font-weight: bold;
    }

    .role-seller {
      color: #2196f3;
      font-weight: bold;
    }

    .role-customer {
      color: #9e9e9e;
      font-weight: bold;
    }

    .success {
      color: #4caf50;
      font-weight: bold;
    }

    .error {
      color: #f44336;
      font-weight: bold;
    }

    pre {
      background: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 12px;
    }

    h3 {
      margin-top: 0;
      color: #333;
    }
  `]
})
export class RolePersistenceTestComponent implements OnInit {
  currentUser: any = null;
  storageInfo: string = '';

  constructor(
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadStorageInfo();
    
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.loadStorageInfo();
    });
  }

  loadUserInfo(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  loadStorageInfo(): void {
    const stored = localStorage.getItem('currentUser');
    this.storageInfo = stored ? JSON.stringify(JSON.parse(stored), null, 2) : 'No data in localStorage';
  }

  refreshUserData(): void {
    this.authService.refreshUserData().then(() => {
      this.snackBar.open('User data refreshed successfully', 'Close', { duration: 3000 });
      this.loadUserInfo();
      this.loadStorageInfo();
    }).catch(error => {
      this.snackBar.open('Error refreshing user data: ' + error.message, 'Close', { duration: 5000 });
    });
  }

  forceReloadUser(): void {
    this.authService.forceReloadUser().then(() => {
      this.snackBar.open('User force reloaded successfully', 'Close', { duration: 3000 });
      this.loadUserInfo();
      this.loadStorageInfo();
    }).catch(error => {
      this.snackBar.open('Error force reloading user: ' + error.message, 'Close', { duration: 5000 });
    });
  }

  clearStorage(): void {
    localStorage.removeItem('currentUser');
    this.snackBar.open('Storage cleared', 'Close', { duration: 3000 });
    this.loadStorageInfo();
  }

  reloadPage(): void {
    window.location.reload();
  }
}
