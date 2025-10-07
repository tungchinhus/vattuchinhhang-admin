import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = signal(false);
  private _currentUser = signal<User | null>(null);
  private authSubject = new BehaviorSubject<boolean>(false);

  isAuthenticated = this._isAuthenticated.asReadonly();
  currentUser = this._currentUser.asReadonly();
  isAuthenticated$ = this.authSubject.asObservable();

  constructor() {
    // Mock authentication for demo purposes
    this.mockLogin();
  }

  private mockLogin(): void {
    const mockUser: User = {
      id: '1',
      username: 'admin',
      email: 'admin@vattuchinhhang.com',
      fullName: 'Administrator',
      roles: ['admin']
    };
    
    this._currentUser.set(mockUser);
    this._isAuthenticated.set(true);
    this.authSubject.next(true);
  }

  login(username: string, password: string): Observable<boolean> {
    // Mock login logic
    return new Observable(observer => {
      setTimeout(() => {
        if (username === 'admin' && password === 'admin') {
          this.mockLogin();
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this.authSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this._currentUser();
  }

  hasAnyRoleSync(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return roles.some(role => user.roles.includes(role));
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return user.roles.includes(role);
  }
}
