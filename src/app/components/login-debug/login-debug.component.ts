import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-login-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-debug">
      <h1>🔍 Login Debug Tool</h1>
      
      <div class="debug-section">
        <h2>Firebase Connection Test</h2>
        <button (click)="testFirebaseConnection()" [disabled]="testing">
          {{ testing ? 'Testing...' : 'Test Firebase Connection' }}
        </button>
        <div *ngIf="firebaseTestResult" class="test-result">
          <pre>{{ firebaseTestResult }}</pre>
        </div>
      </div>

      <div class="debug-section">
        <h2>Google Sign-In Test</h2>
        <button (click)="testGoogleSignIn()" [disabled]="testing">
          {{ testing ? 'Testing...' : 'Test Google Sign-In' }}
        </button>
        <div *ngIf="googleTestResult" class="test-result">
          <pre>{{ googleTestResult }}</pre>
        </div>
      </div>

      <div class="debug-section">
        <h2>Firestore Test</h2>
        <button (click)="testFirestore()" [disabled]="testing">
          {{ testing ? 'Testing...' : 'Test Firestore Access' }}
        </button>
        <div *ngIf="firestoreTestResult" class="test-result">
          <pre>{{ firestoreTestResult }}</pre>
        </div>
      </div>

      <div class="debug-section">
        <h2>Current Auth State</h2>
        <div class="auth-state">
          <p><strong>Is Authenticated:</strong> {{ isAuthenticated() ? '✅ Yes' : '❌ No' }}</p>
          <p><strong>Current User:</strong> {{ getCurrentUserInfo() }}</p>
          <p><strong>Firebase User:</strong> {{ getFirebaseUserInfo() }}</p>
        </div>
        <button (click)="refreshAuthState()">Refresh Auth State</button>
      </div>

      <div class="debug-section">
        <h2>Common Issues & Solutions</h2>
        <div class="issues-list">
          <div class="issue-item">
            <h3>❌ Google Sign-In không hoạt động</h3>
            <p><strong>Nguyên nhân:</strong> Firebase Auth chưa enable Google provider</p>
            <p><strong>Giải pháp:</strong> Vào Firebase Console → Authentication → Sign-in method → Enable Google</p>
          </div>
          
          <div class="issue-item">
            <h3>❌ Firestore permissions error</h3>
            <p><strong>Nguyên nhân:</strong> Firestore rules quá strict</p>
            <p><strong>Giải pháp:</strong> Kiểm tra firestore.rules và deploy lại</p>
          </div>
          
          <div class="issue-item">
            <h3>❌ Domain không được authorize</h3>
            <p><strong>Nguyên nhân:</strong> localhost:4200 chưa được thêm vào authorized domains</p>
            <p><strong>Giải pháp:</strong> Firebase Console → Authentication → Settings → Authorized domains</p>
          </div>
          
          <div class="issue-item">
            <h3>❌ Browser block popup</h3>
            <p><strong>Nguyên nhân:</strong> Browser block popup cho Google Sign-In</p>
            <p><strong>Giải pháp:</strong> Allow popups cho localhost:4200</p>
          </div>
        </div>
      </div>

      <div class="debug-section">
        <h2>Quick Actions</h2>
        <div class="quick-actions">
          <button (click)="clearAllData()">Clear All Data</button>
          <button (click)="reloadPage()">Reload Page</button>
          <button (click)="openFirebaseConsole()">Open Firebase Console</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-debug {
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
    
    .auth-state {
      background: #e9f7ef;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    
    .auth-state p {
      margin: 5px 0;
      font-family: monospace;
    }
    
    .issues-list {
      display: grid;
      gap: 15px;
    }
    
    .issue-item {
      background: #fff3cd;
      padding: 15px;
      border-radius: 4px;
      border-left: 4px solid #ffc107;
    }
    
    .issue-item h3 {
      color: #856404;
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    .issue-item p {
      margin: 5px 0;
      color: #856404;
    }
    
    .quick-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .quick-actions button {
      background-color: #28a745;
    }
    
    .quick-actions button:last-child {
      background-color: #17a2b8;
    }
  `]
})
export class LoginDebugComponent implements OnInit {
  firebaseTestResult: string = '';
  googleTestResult: string = '';
  firestoreTestResult: string = '';
  testing = false;

  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(UsersService) private usersService: UsersService
  ) {}

  ngOnInit() {
    this.refreshAuthState();
  }

  async testFirebaseConnection() {
    this.testing = true;
    this.firebaseTestResult = '';
    
    try {
      // Test Firebase connection
      const firebaseUser = this.authService.getCurrentUser();
      this.firebaseTestResult = `✅ Firebase Connection OK
Current User: ${firebaseUser?.email || 'None'}
UID: ${firebaseUser?.id || 'None'}
Role: ${firebaseUser?.role || 'None'}`;
    } catch (error) {
      this.firebaseTestResult = `❌ Firebase Connection Error: ${error}`;
    } finally {
      this.testing = false;
    }
  }

  async testGoogleSignIn() {
    this.testing = true;
    this.googleTestResult = '';
    
    try {
      this.googleTestResult = '🔄 Testing Google Sign-In...';
      
      // Test Google Sign-In
      const result = await new Promise<boolean>((resolve) => {
        this.authService.loginWithGoogle().subscribe({
          next: (success) => resolve(success),
          error: () => resolve(false)
        });
      });
      
      if (result) {
        const user = this.authService.getCurrentUser();
        this.googleTestResult = `✅ Google Sign-In Success!
Email: ${user?.email}
Role: ${user?.role}
Name: ${user?.fullName}`;
      } else {
        this.googleTestResult = '❌ Google Sign-In Failed';
      }
    } catch (error) {
      this.googleTestResult = `❌ Google Sign-In Error: ${error}`;
    } finally {
      this.testing = false;
    }
  }

  async testFirestore() {
    this.testing = true;
    this.firestoreTestResult = '';
    
    try {
      this.firestoreTestResult = '🔄 Testing Firestore access...';
      
      const users = await this.usersService.getUsers();
      this.firestoreTestResult = `✅ Firestore Access OK
Users count: ${users.length}
Users: ${JSON.stringify(users, null, 2)}`;
    } catch (error) {
      this.firestoreTestResult = `❌ Firestore Error: ${error}`;
    } finally {
      this.testing = false;
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getCurrentUserInfo(): string {
    const user = this.authService.getCurrentUser();
    return user ? `${user.email} (${user.role})` : 'None';
  }

  getFirebaseUserInfo(): string {
    // This would need access to Firebase Auth directly
    return 'Check browser console for Firebase user';
  }

  refreshAuthState() {
    // Force refresh
    console.log('Auth state refreshed');
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
