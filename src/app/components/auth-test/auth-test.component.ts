import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-test',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="auth-test-container">
      <mat-card class="auth-test-card">
        <mat-card-header>
          <mat-card-title>🔒 Authentication Test</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="auth-status">
            <h3>Authentication Status:</h3>
            <p [class]="isAuthenticated ? 'authenticated' : 'not-authenticated'">
              {{ isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated' }}
            </p>
            
            <div *ngIf="currentUser" class="user-info">
              <h4>Current User:</h4>
              <p><strong>Name:</strong> {{ currentUser.fullName }}</p>
              <p><strong>Email:</strong> {{ currentUser.email }}</p>
              <p><strong>Roles:</strong> {{ currentUser.roles.join(', ') }}</p>
            </div>
          </div>
          
          <div class="test-actions">
            <button mat-raised-button color="primary" (click)="checkAuth()">
              <mat-icon>refresh</mat-icon>
              Check Auth Status
            </button>
            
            <button mat-raised-button color="warn" (click)="logout()">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
            
            <button mat-raised-button color="accent" (click)="goToLogin()">
              <mat-icon>login</mat-icon>
              Go to Login
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-test-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .auth-test-card {
      margin-bottom: 20px;
    }
    
    .auth-status {
      margin-bottom: 20px;
    }
    
    .authenticated {
      color: #4caf50;
      font-weight: bold;
    }
    
    .not-authenticated {
      color: #f44336;
      font-weight: bold;
    }
    
    .user-info {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      margin-top: 15px;
    }
    
    .test-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .test-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class AuthTestComponent implements OnInit {
  isAuthenticated = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuth();
  }

  checkAuth(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
    
    console.log('Auth Test - isAuthenticated:', this.isAuthenticated);
    console.log('Auth Test - currentUser:', this.currentUser);
  }

  logout(): void {
    this.authService.logout();
  }

  goToLogin(): void {
    this.router.navigate(['/dang-nhap']);
  }
}
