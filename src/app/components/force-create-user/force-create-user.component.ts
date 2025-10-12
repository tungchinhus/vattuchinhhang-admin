import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-force-create-user',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="force-create-user">
      <h1>🔧 Force Create User Tool</h1>
      
      <div class="debug-section">
        <h2>Current Auth State</h2>
        <div class="auth-info">
          <p><strong>Is Authenticated:</strong> {{ isAuthenticated() ? '✅ Yes' : '❌ No' }}</p>
          <p><strong>Current User:</strong> {{ getCurrentUserInfo() }}</p>
          <p><strong>Firebase UID:</strong> {{ getFirebaseUID() }}</p>
        </div>
      </div>

      <div class="debug-section">
        <h2>Force Create User in Firestore</h2>
        <p>This will create the current authenticated user in Firestore with the appropriate role.</p>
        <button (click)="forceCreateUser()" [disabled]="creating">
          {{ creating ? 'Creating...' : 'Force Create User' }}
        </button>
        <div *ngIf="createResult" class="test-result">
          <pre>{{ createResult }}</pre>
        </div>
      </div>

      <div class="debug-section">
        <h2>Test Firestore After Creation</h2>
        <button (click)="testFirestoreAfter()" [disabled]="testing">
          {{ testing ? 'Testing...' : 'Test Firestore Access' }}
        </button>
        <div *ngIf="firestoreResult" class="test-result">
          <pre>{{ firestoreResult }}</pre>
        </div>
      </div>

      <div class="debug-section">
        <h2>Actions</h2>
        <div class="actions">
          <button (click)="clearAllData()">Clear All Data</button>
          <button (click)="reloadPage()">Reload Page</button>
          <button (click)="openFirebaseConsole()">Open Firebase Console</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .force-create-user {
      max-width: 800px;
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
    
    .debug-section button {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    
    .debug-section button:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    
    .test-result {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      margin-top: 10px;
      border-left: 4px solid #007bff;
    }
    
    .test-result pre {
      margin: 0;
      font-size: 12px;
      white-space: pre-wrap;
    }
    
    .auth-info {
      background: #e9f7ef;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    
    .auth-info p {
      margin: 5px 0;
      font-family: monospace;
    }
    
    .actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .actions button {
      background-color: #28a745;
    }
    
    .actions button:last-child {
      background-color: #17a2b8;
    }
  `]
})
export class ForceCreateUserComponent implements OnInit {
  createResult: string = '';
  firestoreResult: string = '';
  creating = false;
  testing = false;

  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(UsersService) private usersService: UsersService
  ) {}

  ngOnInit() {
    console.log('ForceCreateUser: Component initialized');
    console.log('ForceCreateUser: Auth state:', this.authService.isAuthenticated());
    console.log('ForceCreateUser: Current user:', this.authService.getCurrentUser());
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getCurrentUserInfo(): string {
    const user = this.authService.getCurrentUser();
    return user ? `${user.email} (${user.role})` : 'None';
  }

  getFirebaseUID(): string {
    const user = this.authService.getCurrentUser();
    return user?.id || 'None';
  }

  async forceCreateUser() {
    this.creating = true;
    this.createResult = '';
    
    try {
      console.log('ForceCreateUser: Starting force create user...');
      this.createResult = '🔄 Force creating user in Firestore...';
      
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.createResult = '❌ No authenticated user found. Please login first.';
        return;
      }

      // Determine role based on email
      let role = UserRole.CUSTOMER;
      if (currentUser.email === 'tungchinhus@gmail.com') {
        role = UserRole.SUPER_ADMIN;
      }

      const userData = {
        name: currentUser.fullName || currentUser.email || 'User',
        email: currentUser.email || '',
        role: role,
        avatarUrl: currentUser.avatarUrl || '',
        createdAt: new Date()
      };

      console.log('ForceCreateUser: Creating user with data:', userData);

      const userId = await this.usersService.addUser(userData);
      
      this.createResult = `✅ User created successfully!
User ID: ${userId}
Email: ${userData.email}
Role: ${userData.role}
Name: ${userData.name}`;
      
      console.log('ForceCreateUser: User created successfully:', userId);
      
      // Refresh auth state
      await this.authService.refreshUserData();
      
    } catch (error) {
      this.createResult = `❌ Error creating user: ${error}`;
      console.error('ForceCreateUser: Error creating user:', error);
    } finally {
      this.creating = false;
    }
  }

  async testFirestoreAfter() {
    this.testing = true;
    this.firestoreResult = '';
    
    try {
      console.log('ForceCreateUser: Testing Firestore access after user creation...');
      this.firestoreResult = '🔄 Testing Firestore access...';
      
      const users = await this.usersService.getUsers();
      this.firestoreResult = `✅ Firestore Access OK!
Users count: ${users.length}
Users: ${JSON.stringify(users, null, 2)}`;
      
      console.log('ForceCreateUser: Firestore test successful:', users);
    } catch (error) {
      this.firestoreResult = `❌ Firestore Error: ${error}`;
      console.error('ForceCreateUser: Firestore test failed:', error);
    } finally {
      this.testing = false;
    }
  }

  clearAllData() {
    localStorage.clear();
    sessionStorage.clear();
    alert('All data cleared. Please reload the page.');
  }

  reloadPage() {
    window.location.reload();
  }

  openFirebaseConsole() {
    window.open('https://console.firebase.google.com/project/vattuchinhhang-c5952', '_blank');
  }
}
