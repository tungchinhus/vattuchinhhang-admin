import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="unauthorized-container">
      <mat-card class="unauthorized-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon color="warn">block</mat-icon>
            Không có quyền truy cập
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <p>Bạn không có quyền truy cập vào trang này.</p>
          <p>Vui lòng liên hệ quản trị viên để được cấp quyền phù hợp.</p>
        </mat-card-content>
        
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Quay lại
          </button>
          <button mat-raised-button color="accent" (click)="goHome()">
            <mat-icon>home</mat-icon>
            Về trang chủ
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    
    .unauthorized-card {
      max-width: 500px;
      text-align: center;
    }
    
    mat-card-header {
      justify-content: center;
    }
    
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    mat-card-content p {
      margin: 10px 0;
      color: #666;
    }
    
    mat-card-actions {
      justify-content: center;
      gap: 10px;
    }
  `]
})
export class UnauthorizedComponent {
  
  constructor(private router: Router) {}
  
  goBack(): void {
    window.history.back();
  }
  
  goHome(): void {
    this.router.navigate(['/dashboard']);
  }
}