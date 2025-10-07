import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dang-nhap',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './dang-nhap.component.html',
  styleUrl: './dang-nhap.component.css'
})
export class DangNhapComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['admin', [Validators.required]],
      password: ['admin', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { username, password } = this.loginForm.value;
      
      this.authService.login(username, password).subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Có lỗi xảy ra khi đăng nhập';
          console.error('Login error:', error);
        }
      });
    }
  }
}
