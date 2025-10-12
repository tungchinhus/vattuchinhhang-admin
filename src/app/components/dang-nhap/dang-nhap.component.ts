import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dang-nhap',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './dang-nhap.component.html',
  styleUrl: './dang-nhap.component.css'
})
export class DangNhapComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  rememberMe = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    console.log('Login component: Checking authentication state');
    if (this.authService.isAuthenticated()) {
      console.log('Login component: User is authenticated, redirecting to dashboard');
      this.router.navigate(['/dashboard']);
    } else {
      console.log('Login component: User is not authenticated, staying on login page');
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password, rememberMe } = this.loginForm.value;
      
      this.authService.login(username, password).subscribe({
        next: (success: boolean) => {
          this.isLoading = false;
          
          if (success) {
            this.snackBar.open('Đăng nhập thành công!', 'Đóng', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
            
            // Store remember me preference
            if (rememberMe) {
              localStorage.setItem('rememberMe', 'true');
            } else {
              localStorage.removeItem('rememberMe');
            }
            
            // Redirect to main page
            this.router.navigate(['/dashboard']);
          } else {
            this.snackBar.open('Tên đăng nhập hoặc mật khẩu không đúng', 'Đóng', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Login error:', error);
          this.snackBar.open('Có lỗi xảy ra khi đăng nhập', 'Đóng', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onGoogleSignIn(): void {
    this.isLoading = true;
    
    // Try popup first, fallback to redirect if it fails
    this.authService.loginWithGoogle().subscribe({
      next: (success: boolean) => {
        this.isLoading = false;
        
        if (success) {
          const currentUser = this.authService.getCurrentUser();
          let message = 'Đăng nhập Google thành công!';
          
          if (currentUser?.email === 'tungchinhus@gmail.com') {
            message = 'Chào mừng Siêu quản trị viên! Bạn có quyền cao nhất trong hệ thống.';
          }
          
          this.snackBar.open(message, 'Đóng', {
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          
          // Redirect to main page
          this.router.navigate(['/dashboard']);
        } else {
          // Popup failed, try redirect method
          console.log('Popup failed, trying redirect method...');
          this.authService.loginWithGoogleRedirect();
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Google Sign-In error:', error);
        
        // If popup fails due to COOP or other issues, try redirect
        if (error.message && error.message.includes('Cross-Origin-Opener-Policy')) {
          console.log('COOP error detected, trying redirect method...');
          this.authService.loginWithGoogleRedirect();
        } else {
          this.snackBar.open('Có lỗi xảy ra khi đăng nhập Google', 'Đóng', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      }
    });
  }

  quickLoginSuperAdmin(): void {
    this.isLoading = true;
    
    // Pre-fill the form with super admin email
    this.loginForm.patchValue({
      username: 'tungchinhus@gmail.com',
      password: 'superadmin123' // This won't work with Google Auth, just for demo
    });
    
    // Show instruction message
    this.snackBar.open('Vui lòng sử dụng nút "Đăng nhập bằng Google" với tài khoản tungchinhus@gmail.com', 'Đóng', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['info-snackbar']
    });
    
    this.isLoading = false;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Trường này là bắt buộc';
    }
    if (field?.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength'].requiredLength;
      return `Tối thiểu ${requiredLength} ký tự`;
    }
    if (field?.hasError('email')) {
      return 'Email không hợp lệ';
    }
    if (field?.hasError('pattern')) {
      return 'Định dạng không đúng';
    }
    return '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Demo accounts for testing
  fillDemoAccount(accountType: 'admin' | 'manager' | 'user'): void {
    const accounts = {
      admin: { username: 'admin', password: 'admin123' },
      manager: { username: 'manager1@thibidi.com', password: 'manager123' },
      user: { username: 'user1@thibidi.com', password: 'user123' }
    };
    
    const account = accounts[accountType];
    this.loginForm.patchValue(account);
  }

  // Test validation
  testValidation(): void {
    this.loginForm.patchValue({
      username: '',
      password: '12'
    });
    this.markFormGroupTouched();
  }

  // Clear form
  clearForm(): void {
    this.loginForm.reset();
    this.loginForm.patchValue({
      rememberMe: false
    });
  }

  // Test logout functionality
  testLogout(): void {
    console.log('Testing logout functionality...');
    this.authService.logout();
  }

  // Test authentication state
  testAuthState(): void {
    console.log('Current auth state:', this.authService.isAuthenticated());
    console.log('Current user:', this.authService.getCurrentUser());
    console.log('=== AUTH DEBUG ===');
    console.log('Firebase currentUser:', this.authService.getCurrentUser());
    console.log('isAuthenticated():', this.authService.isAuthenticated());
    console.log('==================');
  }

  // Force clear authentication for testing
  forceClearAuth(): void {
    console.log('Force clearing authentication state...');
    this.authService.forceClearAuth();
  }
}
