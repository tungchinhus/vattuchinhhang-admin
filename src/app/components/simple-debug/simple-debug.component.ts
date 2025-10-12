import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-simple-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="simple-debug">
      <h1>🔍 Simple Debug Tool</h1>
      
      <div class="debug-section">
        <h2>Current Auth State</h2>
        <div class="auth-info">
          <p><strong>Is Authenticated:</strong> {{ isAuthenticated() ? '✅ Yes' : '❌ No' }}</p>
          <p><strong>Current User:</strong> {{ getCurrentUserInfo() }}</p>
          <p><strong>Firebase UID:</strong> {{ getFirebaseUID() }}</p>
        </div>
      </div>

      <div class="debug-section">
        <h2>Firestore Test</h2>
        <button (click)="testFirestoreSimple()" [disabled]="testing">
          {{ testing ? 'Testing...' : 'Test Firestore (Simple)' }}
        </button>
        <div *ngIf="firestoreResult" class="test-result">
          <pre>{{ firestoreResult }}</pre>
        </div>
      </div>

      <div class="debug-section">
        <h2>Google Sign-In Test</h2>
        <button (click)="testGoogleSignInSimple()" [disabled]="testing">
          {{ testing ? 'Testing...' : 'Test Google Sign-In' }}
        </button>
        <div *ngIf="googleResult" class="test-result">
          <pre>{{ googleResult }}</pre>
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
    .simple-debug {
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
export class SimpleDebugComponent implements OnInit {
  firestoreResult: string = '';
  googleResult: string = '';
  testing = false;

  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(UsersService) private usersService: UsersService
  ) {}

  ngOnInit() {
    console.log('SimpleDebug: Component initialized');
    console.log('SimpleDebug: Auth state:', this.authService.isAuthenticated());
    console.log('SimpleDebug: Current user:', this.authService.getCurrentUser());
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

  async testFirestoreSimple() {
    this.testing = true;
    this.firestoreResult = '';
    
    try {
      console.log('SimpleDebug: Testing Firestore access...');
      this.firestoreResult = '🔄 Testing Firestore access...';
      
      const users = await this.usersService.getUsers();
      this.firestoreResult = `✅ Firestore Access OK!
Users count: ${users.length}
Users: ${JSON.stringify(users, null, 2)}`;
      
      console.log('SimpleDebug: Firestore test successful:', users);
    } catch (error) {
      this.firestoreResult = `❌ Firestore Error: ${error}`;
      console.error('SimpleDebug: Firestore test failed:', error);
    } finally {
      this.testing = false;
    }
  }

  async testGoogleSignInSimple() {
    this.testing = true;
    this.googleResult = '';
    
    try {
      console.log('SimpleDebug: Testing Google Sign-In...');
      this.googleResult = '🔄 Testing Google Sign-In...';
      
      const result = await new Promise<boolean>((resolve) => {
        this.authService.loginWithGoogle().subscribe({
          next: (success) => resolve(success),
          error: (error) => {
            console.error('SimpleDebug: Google Sign-In error:', error);
            resolve(false);
          }
        });
      });
      
      if (result) {
        const user = this.authService.getCurrentUser();
        this.googleResult = `✅ Google Sign-In Success!
Email: ${user?.email}
Role: ${user?.role}
Name: ${user?.fullName}
UID: ${user?.id}`;
        console.log('SimpleDebug: Google Sign-In successful:', user);
      } else {
        this.googleResult = '❌ Google Sign-In Failed';
        console.log('SimpleDebug: Google Sign-In failed');
      }
    } catch (error) {
      this.googleResult = `❌ Google Sign-In Error: ${error}`;
      console.error('SimpleDebug: Google Sign-In error:', error);
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
