import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-auth-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-debug">
      <h1>🔧 Authentication Debug</h1>
      
      <div class="debug-section">
        <h2>Current User Info</h2>
        <div class="info-card">
          <p><strong>Email:</strong> {{ getCurrentUserEmail() }}</p>
          <p><strong>Name:</strong> {{ getCurrentUserName() }}</p>
          <p><strong>Role:</strong> {{ getCurrentUserRole() }}</p>
          <p><strong>UID:</strong> {{ getCurrentUserUID() }}</p>
          <p><strong>Is Super Admin:</strong> {{ isSuperAdmin() ? '✅ Yes' : '❌ No' }}</p>
          <p><strong>Is Admin:</strong> {{ isAdmin() ? '✅ Yes' : '❌ No' }}</p>
          <p><strong>Can Manage Users:</strong> {{ canManageUsers() ? '✅ Yes' : '❌ No' }}</p>
        </div>
      </div>

      <div class="debug-section">
        <h2>Firestore Users</h2>
        <button (click)="loadFirestoreUsers()" [disabled]="loadingUsers">
          {{ loadingUsers ? 'Loading...' : 'Load Users from Firestore' }}
        </button>
        
        <div *ngIf="firestoreUsers.length > 0" class="users-list">
          <h3>Users in Firestore ({{ firestoreUsers.length }})</h3>
          <div *ngFor="let user of firestoreUsers" class="user-item">
            <p><strong>{{ user.name }}</strong> ({{ user.email }})</p>
            <p>Role: {{ user.role }} | ID: {{ user.id }}</p>
          </div>
        </div>
        
        <div *ngIf="firestoreError" class="error-message">
          <h3>❌ Firestore Error:</h3>
          <p>{{ firestoreError }}</p>
        </div>
      </div>

      <div class="debug-section">
        <h2>Test Actions</h2>
        <div class="test-buttons">
          <button (click)="testCreateUser()" [disabled]="testing">
            {{ testing ? 'Testing...' : 'Test Create User' }}
          </button>
          
          <button (click)="refreshAuth()">
            Refresh Auth State
          </button>
          
          <button (click)="forceReloadUser()">
            Force Reload User
          </button>
          
          <button (click)="clearLocalStorage()">
            Clear Local Storage
          </button>
        </div>
        
        <div *ngIf="testResult" class="test-result">
          <h3>Test Result:</h3>
          <pre>{{ testResult }}</pre>
        </div>
      </div>

      <div class="debug-section">
        <h2>Authentication Flow</h2>
        <div class="flow-info">
          <h3>Expected Flow:</h3>
          <ol>
            <li>User signs in with Google</li>
            <li>System checks if user exists in Firestore</li>
            <li>If not exists, creates user with appropriate role</li>
            <li>tungchinhus@gmail.com gets SUPER_ADMIN role</li>
            <li>Other users get CUSTOMER role by default</li>
          </ol>
          
          <h3>Current Status:</h3>
          <ul>
            <li>✅ Google Sign-In implemented</li>
            <li>✅ Role detection by email</li>
            <li>✅ Firestore rules updated</li>
            <li>✅ Fallback authentication</li>
            <li>✅ Error handling improved</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-debug {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .debug-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    
    .debug-section h2 {
      color: #333;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    
    .info-card {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #007bff;
    }
    
    .info-card p {
      margin: 8px 0;
      font-family: monospace;
    }
    
    .users-list {
      margin-top: 15px;
    }
    
    .user-item {
      background: #e9f7ef;
      padding: 10px;
      margin: 8px 0;
      border-radius: 4px;
      border-left: 3px solid #28a745;
    }
    
    .user-item p {
      margin: 4px 0;
      font-size: 14px;
    }
    
    .error-message {
      background: #f8d7da;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #dc3545;
      margin-top: 15px;
    }
    
    .error-message h3 {
      color: #721c24;
      margin-top: 0;
    }
    
    .test-buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .test-buttons button {
      padding: 10px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .test-buttons button:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    
    .test-result {
      background: #d1ecf1;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #17a2b8;
    }
    
    .test-result pre {
      background: #f8f9fa;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 12px;
    }
    
    .flow-info {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
    }
    
    .flow-info h3 {
      color: #333;
      margin-top: 0;
    }
    
    .flow-info ol, .flow-info ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    
    .flow-info li {
      margin: 5px 0;
    }
  `]
})
export class AuthDebugComponent implements OnInit {
  firestoreUsers: any[] = [];
  firestoreError: string = '';
  loadingUsers = false;
  testing = false;
  testResult: string = '';

  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(UsersService) private usersService: UsersService
  ) {}

  ngOnInit() {
    this.loadFirestoreUsers();
  }

  getCurrentUserEmail(): string {
    const user = this.authService.getCurrentUser();
    return user?.email || 'Not logged in';
  }

  getCurrentUserName(): string {
    const user = this.authService.getCurrentUser();
    return user?.fullName || 'Not logged in';
  }

  getCurrentUserRole(): string {
    const user = this.authService.getCurrentUser();
    return user?.role || 'Not logged in';
  }

  getCurrentUserUID(): string {
    const user = this.authService.getCurrentUser();
    return user?.id || 'Not logged in';
  }

  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  canManageUsers(): boolean {
    return this.authService.canManageUsers();
  }

  async loadFirestoreUsers() {
    this.loadingUsers = true;
    this.firestoreError = '';
    
    try {
      this.firestoreUsers = await this.usersService.getUsers();
      console.log('Loaded Firestore users:', this.firestoreUsers);
    } catch (error) {
      this.firestoreError = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error loading Firestore users:', error);
    } finally {
      this.loadingUsers = false;
    }
  }

  async testCreateUser() {
    this.testing = true;
    this.testResult = '';
    
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.testResult = 'No user logged in';
        return;
      }

      const testUserData = {
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.CUSTOMER,
        avatarUrl: '',
        createdAt: new Date()
      };

      const userId = await this.usersService.addUser(testUserData);
      this.testResult = `✅ Successfully created test user with ID: ${userId}`;
      
      // Reload users list
      await this.loadFirestoreUsers();
    } catch (error) {
      this.testResult = `❌ Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error('Error creating test user:', error);
    } finally {
      this.testing = false;
    }
  }

  async refreshAuth() {
    // Force refresh auth state
    const user = this.authService.getCurrentUser();
    console.log('Current auth state before refresh:', user);
    
    try {
      await this.authService.refreshUserData();
      const refreshedUser = this.authService.getCurrentUser();
      this.testResult = `Auth refreshed. Current user: ${refreshedUser?.email || 'None'}, Role: ${refreshedUser?.role || 'None'}`;
      console.log('Auth refreshed:', refreshedUser);
    } catch (error) {
      this.testResult = `Error refreshing auth: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  async forceReloadUser() {
    try {
      await this.authService.forceReloadUser();
      const reloadedUser = this.authService.getCurrentUser();
      this.testResult = `User force reloaded. Current user: ${reloadedUser?.email || 'None'}, Role: ${reloadedUser?.role || 'None'}`;
      console.log('User force reloaded:', reloadedUser);
    } catch (error) {
      this.testResult = `Error force reloading user: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  clearLocalStorage() {
    localStorage.clear();
    sessionStorage.clear();
    this.testResult = 'Local storage cleared. Please refresh the page.';
  }
}
