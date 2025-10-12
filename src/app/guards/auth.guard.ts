import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('=== AUTHGUARD CALLED ===');
    console.log('AuthGuard: Route being accessed');
    
    // Check authentication status
    const isAuth = this.authService.isAuthenticated();
    console.log('AuthGuard: Checking authentication, isAuth =', isAuth);
    
    if (isAuth) {
      console.log('AuthGuard: User is authenticated, allowing access');
      return true;
    }
    
    console.log('AuthGuard: User not authenticated, redirecting to login');
    this.router.navigate(['/dang-nhap']);
    return false;
  }
}
