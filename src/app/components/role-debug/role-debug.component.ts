import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-role-debug',
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
      <mat-card class="debug-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>bug_report</mat-icon>
            Role Debug Test
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div class="debug-section">
            <h3>Current User:</h3>
            <pre>{{ currentUserDebug }}</pre>
          </div>

          <div class="debug-section">
            <h3>Role Tests:</h3>
            <div class="test-results">
              <p><strong>isSuperAdmin():</strong> 
                <span [class]="authService.isSuperAdmin() ? 'success' : 'error'">
                  {{ authService.isSuperAdmin() }}
                </span>
              </p>
              <p><strong>isAdmin():</strong> 
                <span [class]="authService.isAdmin() ? 'success' : 'error'">
                  {{ authService.isAdmin() }}
                </span>
              </p>
              <p><strong>canManageUsers():</strong> 
                <span [class]="authService.canManageUsers() ? 'success' : 'error'">
                  {{ authService.canManageUsers() }}
                </span>
              </p>
            </div>
          </div>

          <div class="debug-section">
            <h3>Manual Role Check:</h3>
            <div class="manual-tests">
              <p><strong>UserRole.SUPER_ADMIN:</strong> {{ UserRole.SUPER_ADMIN }}</p>
              <p><strong>UserRole.ADMIN:</strong> {{ UserRole.ADMIN }}</p>
              <p><strong>UserRole.CUSTOMER:</strong> {{ UserRole.CUSTOMER }}</p>
              <p><strong>UserRole.SELLER:</strong> {{ UserRole.SELLER }}</p>
            </div>
          </div>

          <div class="debug-section">
            <h3>Actions:</h3>
            <div class="button-group">
              <button mat-raised-button color="primary" (click)="refreshData()">
                <mat-icon>refresh</mat-icon>
                Refresh Data
              </button>
              
              <button mat-raised-button color="accent" (click)="refreshRoleFromEmail()">
                <mat-icon>email</mat-icon>
                Refresh Role from Email
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

    .debug-card {
      margin-bottom: 20px;
    }

    .debug-section {
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

    .test-results p, .manual-tests p {
      margin: 8px 0;
    }
  `]
})
export class RoleDebugComponent implements OnInit {
  currentUserDebug: string = '';
  UserRole = UserRole; // Make UserRole available in template

  constructor(
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.refreshData();
    
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.refreshData();
    });
  }

  refreshData(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUserDebug = JSON.stringify({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        roleType: typeof user.role,
        avatarUrl: user.avatarUrl
      }, null, 2);
    } else {
      this.currentUserDebug = 'No user found';
    }
  }

  refreshRoleFromEmail(): void {
    this.authService.refreshRoleFromEmail().then(() => {
      this.snackBar.open('Role refreshed from email successfully', 'Close', { duration: 3000 });
      this.refreshData();
    }).catch(error => {
      this.snackBar.open('Error refreshing role: ' + error.message, 'Close', { duration: 5000 });
    });
  }

  clearStorage(): void {
    localStorage.removeItem('currentUser');
    this.snackBar.open('Storage cleared', 'Close', { duration: 3000 });
    this.refreshData();
  }

  reloadPage(): void {
    window.location.reload();
  }
}
