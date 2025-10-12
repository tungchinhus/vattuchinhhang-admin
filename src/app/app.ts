import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { SidenavService } from './services/sidenav.service';
import { AuthService } from './services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  isAuthenticated = false;
  private destroy$ = new Subject<void>();

  constructor(
    public sidenavService: SidenavService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuth: boolean) => {
        console.log('App: Authentication state changed:', isAuth);
        this.isAuthenticated = isAuth;
        
        // If not authenticated and not on login page, redirect to login
        if (!isAuth && !this.isOnLoginPage()) {
          console.log('App: Not authenticated, redirecting to login');
          this.router.navigate(['/dang-nhap']);
        }
      });
  }

  private isOnLoginPage(): boolean {
    return this.router.url === '/dang-nhap' || this.router.url === '/';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggle() {
    this.sidenavService.toggle();
  }

  getCurrentUserInitials(): string {
    const user = this.authService.getCurrentUser();
    if (!user) return 'U';
    const name = user.fullName || user.email || 'User';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getCurrentUserName(): string {
    const user = this.authService.getCurrentUser();
    return user?.fullName || user?.email || 'Người dùng';
  }

  getCurrentUserEmail(): string {
    const user = this.authService.getCurrentUser();
    return user?.email || 'user@company.com';
  }

  getCurrentUserRole(): string {
    const user = this.authService.getCurrentUser();
    if (!user) return 'User';
    
    switch (user.role) {
      case 'super_admin':
        return 'Siêu quản trị viên';
      case 'admin':
        return 'Quản trị viên';
      case 'seller':
        return 'Người bán';
      case 'customer':
        return 'Khách hàng';
      default:
        return 'User';
    }
  }

  hasAdminRole(): boolean {
    return this.authService.isAdmin() || this.authService.isSuperAdmin();
  }

  logout(): void {
    console.log('App: Logout button clicked');
    this.authService.logout();
  }

  toggleSidenav(): void {
    this.sidenavService.toggle();
  }
}