import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuth: boolean) => {
        this.isAuthenticated = isAuth;
      });
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
    const name = user.fullName || user.username;
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getCurrentUserName(): string {
    const user = this.authService.getCurrentUser();
    return user?.fullName || user?.username || 'Người dùng';
  }

  getCurrentUserEmail(): string {
    const user = this.authService.getCurrentUser();
    return user?.email || 'user@company.com';
  }

  getCurrentUserRole(): string {
    const user = this.authService.getCurrentUser();
    if (!user) return 'User';
    
    const roles = Array.isArray(user.roles) ? user.roles : [];
    if (roles.length === 0) return 'User';
    
    const role = roles[0];
    return typeof role === 'string' ? role : (role as any).name || 'User';
  }

  hasAdminRole(): boolean {
    return this.authService.hasAnyRoleSync(['admin', 'super_admin']);
  }

  logout(): void {
    this.authService.logout();
  }

  toggleSidenav(): void {
    this.sidenavService.toggle();
  }
}