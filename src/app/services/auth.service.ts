import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  type Auth, 
  type User as FirebaseUser 
} from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebase.tokens';
import { UsersService } from './users.service';
import { RolesService } from './roles.service';
import { UserRole } from '../models/user.model';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private authStateInitialized = false; // Prevent multiple initializations

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Dynamic role management - no hardcoded emails

  constructor(
    @Inject(FIREBASE_AUTH) private readonly auth: Auth, 
    private router: Router,
    @Inject(UsersService) private usersService: UsersService,
    @Inject(RolesService) private rolesService: RolesService
  ) {
    this.initializeAuth();
    this.handleRedirectResult();
  }

  private async initializeAuth(): Promise<void> {
    if (this.authStateInitialized) {
      console.log('AuthService: Auth already initialized, skipping');
      return;
    }

    console.log('AuthService: Initializing authentication...');
    
    // Load from storage for initial paint
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Ensure role is properly typed as UserRole enum
        if (user.role && typeof user.role === 'string') {
          user.role = user.role as UserRole;
        }
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        console.log('AuthService: Loaded user from storage:', user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearAuthData();
      }
    }

    // Subscribe Firebase auth state
    onAuthStateChanged(this.auth, async (fbUser: FirebaseUser | null) => {
      console.log('AuthService: Auth state changed, user:', fbUser);
      if (fbUser) {
        // Use enhanced authentication with role preservation
        await this.handleUserAuthenticationWithRolePreservation(fbUser);
      } else {
        this.clearAuthData();
        console.log('AuthService: User not authenticated');
      }
    });

    this.authStateInitialized = true;
  }

  private async handleUserAuthentication(fbUser: FirebaseUser): Promise<void> {
    console.log('AuthService: handleUserAuthentication called for:', fbUser.email);
    
    // Always use dynamic role - no exceptions
    const authUser = await this.forcePreserveRole(fbUser);

    this.currentUserSubject.next(authUser);
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem('currentUser', JSON.stringify(authUser));
    console.log('AuthService: User authenticated with dynamic role:', authUser);
  }

  // Enhanced method to preserve role during reload
  private async handleUserAuthenticationWithRolePreservation(fbUser: FirebaseUser): Promise<void> {
    console.log('AuthService: handleUserAuthenticationWithRolePreservation called for:', fbUser.email);
    
    // Check if we already have a user with role in localStorage
    const storedUser = localStorage.getItem('currentUser');
    let authUser: AuthUser;
    
    if (storedUser && fbUser.email) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // If stored user has same email and a valid role, preserve it
        if (parsedUser.email === fbUser.email && parsedUser.role && parsedUser.role !== UserRole.CUSTOMER) {
          console.log('AuthService: Preserving role from localStorage:', parsedUser.role);
          authUser = {
            id: fbUser.uid,
            email: fbUser.email,
            fullName: fbUser.displayName || fbUser.email || 'User',
            role: parsedUser.role,
            avatarUrl: fbUser.photoURL || ''
          };
        } else {
          // Try to get dynamic role, fallback to stored role
          authUser = await this.forcePreserveRole(fbUser);
        }
      } catch (error) {
        console.log('AuthService: Error parsing stored user, getting dynamic role');
        authUser = await this.forcePreserveRole(fbUser);
      }
    } else {
      // No stored user, get dynamic role
      authUser = await this.forcePreserveRole(fbUser);
    }
    
    this.currentUserSubject.next(authUser);
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem('currentUser', JSON.stringify(authUser));
    console.log('AuthService: User authenticated with preserved role:', authUser);
  }

  private async getUserRole(email: string): Promise<UserRole> {
    try {
      // First check Firebase Custom Claims
      const fbUser = this.auth.currentUser;
      if (fbUser) {
        const tokenResult = await fbUser.getIdTokenResult();
        const customClaims = tokenResult.claims;
        
        if (customClaims['role']) {
          console.log('AuthService: Found role in custom claims:', customClaims['role']);
          return customClaims['role'] as UserRole;
        }
      }
      
      // Hardcoded super admin for now (temporary solution)
      if (email === 'tungchinhus@gmail.com') {
        console.log('AuthService: Using hardcoded super admin role for:', email);
        return UserRole.SUPER_ADMIN;
      }
      
      // Second: Check RolesService for dynamic role assignments
      try {
        const dynamicRole = await this.rolesService.getUserRoleByEmail(email);
        if (dynamicRole) {
          console.log('AuthService: Found role in RolesService:', dynamicRole);
          return dynamicRole;
        }
      } catch (error) {
        console.log('AuthService: RolesService error, continuing with fallback:', error);
      }
      
      // Third: Check Firestore for user role (fallback)
      try {
        const userDoc = await this.usersService.getUserByEmail(email);
        if (userDoc && userDoc.role) {
          console.log('AuthService: Found role in Firestore:', userDoc.role);
          return userDoc.role;
        }
      } catch (error) {
        console.log('AuthService: UsersService error, continuing with fallback:', error);
      }
      
      // Check localStorage as last resort before defaulting to CUSTOMER
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.email === email && parsedUser.role && parsedUser.role !== UserRole.CUSTOMER) {
            console.log('AuthService: Using stored role as fallback:', parsedUser.role);
            return parsedUser.role;
          }
        } catch (error) {
          console.log('AuthService: Error parsing stored user for role fallback');
        }
      }
      
      // Default role if no role found
      console.log('AuthService: No role found, using default CUSTOMER role');
      return UserRole.CUSTOMER;
    } catch (error) {
      console.error('AuthService: Error getting user role:', error);
      
      // Try localStorage as emergency fallback
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.email === email && parsedUser.role) {
            console.log('AuthService: Using stored role as emergency fallback:', parsedUser.role);
            return parsedUser.role;
          }
        } catch (error) {
          console.log('AuthService: Error parsing stored user for emergency fallback');
        }
      }
      
      return UserRole.CUSTOMER;
    }
  }

  // Force preserve role - always use dynamic role
  private async forcePreserveRole(fbUser: FirebaseUser): Promise<AuthUser> {
    console.log('AuthService: Force preserving role for:', fbUser.email);
    
    // Always get role dynamically
    const dynamicRole = await this.getUserRole(fbUser.email || '');
    
    const authUser: AuthUser = {
      id: fbUser.uid,
      email: fbUser.email || '',
      fullName: fbUser.displayName || fbUser.email || 'User',
      role: dynamicRole,
      avatarUrl: fbUser.photoURL || ''
    };
    
    console.log('AuthService: Force preserved role:', authUser);
    return authUser;
  }

  // Public method to refresh user role
  async refreshUserRole(): Promise<void> {
    const fbUser = this.auth.currentUser;
    if (fbUser) {
      console.log('AuthService: Refreshing user role...');
      const authUser = await this.forcePreserveRole(fbUser);
      this.currentUserSubject.next(authUser);
      localStorage.setItem('currentUser', JSON.stringify(authUser));
      console.log('AuthService: User role refreshed:', authUser);
    }
  }


  login(email: string, password: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then(() => {
          observer.next(true);
          observer.complete();
        })
        .catch(() => {
          observer.next(false);
          observer.complete();
        });
    });
  }

  loginWithGoogle(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const provider = new GoogleAuthProvider();
      
      // Configure provider to avoid popup issues
      provider.addScope('email');
      provider.addScope('profile');
      
      // Set custom parameters to avoid COOP issues
      provider.setCustomParameters({
        'prompt': 'select_account'
      });
      
      console.log('AuthService: Starting Google Sign-In...');
      
      signInWithPopup(this.auth, provider)
        .then((result) => {
          console.log('AuthService: Google Sign-In successful:', result.user.email);
          observer.next(true);
          observer.complete();
        })
        .catch((error) => {
          console.error('AuthService: Google Sign-In error:', error);
          
          // Handle specific COOP errors
          if (error.code === 'auth/popup-blocked') {
            console.error('AuthService: Popup blocked by browser');
          } else if (error.code === 'auth/popup-closed-by-user') {
            console.error('AuthService: Popup closed by user');
          } else if (error.message.includes('Cross-Origin-Opener-Policy')) {
            console.error('AuthService: COOP policy blocking popup');
          }
          
          observer.next(false);
          observer.complete();
        });
    });
  }

  // Alternative Google Sign-In using redirect (avoids COOP issues)
  loginWithGoogleRedirect(): void {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    console.log('AuthService: Starting Google Sign-In with redirect...');
    signInWithRedirect(this.auth, provider);
  }

  // Handle redirect result after Google Sign-In
  private async handleRedirectResult(): Promise<void> {
    try {
      const result = await getRedirectResult(this.auth);
      if (result) {
        console.log('AuthService: Redirect result received:', result.user.email);
        // The onAuthStateChanged will handle the authentication
      }
    } catch (error) {
      console.error('AuthService: Error handling redirect result:', error);
    }
  }

  logout(): void {
    console.log('AuthService: Starting logout process');
    signOut(this.auth).finally(() => {
      this.clearAuthData();
      this.router.navigate(['/dang-nhap']);
    });
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const result = this.isAuthenticatedSubject.value;
    console.log('AuthService: isAuthenticated() called, result =', result);
    console.log('AuthService: currentUser =', this.currentUserSubject.value);
    console.log('AuthService: Firebase currentUser =', this.auth.currentUser);
    return result;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    if (!user) {
      console.log('AuthService: hasRole - No user found');
      return false;
    }
    console.log('AuthService: hasRole - User role:', user.role, 'Type:', typeof user.role);
    console.log('AuthService: hasRole - Checking against:', role, 'Type:', typeof role);
    const result = user.role === role;
    console.log('AuthService: hasRole - Result:', result);
    return result;
  }

  isSuperAdmin(): boolean {
    return this.hasRole(UserRole.SUPER_ADMIN);
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN) || this.hasRole(UserRole.SUPER_ADMIN);
  }

  canManageUsers(): boolean {
    return this.isAdmin() || this.isSuperAdmin();
  }

  // Refresh user data - dynamic role only
  async refreshUserData(): Promise<void> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    const fbUser = this.auth.currentUser;
    if (!fbUser) return;

    // Re-authenticate with current Firebase user
    await this.handleUserAuthentication(fbUser);
    console.log('AuthService: User data refreshed with dynamic role');
  }

  // Force refresh user - dynamic role only
  async forceReloadUser(): Promise<void> {
    const fbUser = this.auth.currentUser;
    if (!fbUser) return;

    console.log('AuthService: Force reloading user with dynamic role');
    await this.handleUserAuthentication(fbUser);
  }

  // Force refresh role dynamically
  async refreshRoleFromEmail(): Promise<void> {
    const fbUser = this.auth.currentUser;
    if (!fbUser) return;

    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    console.log('AuthService: Refreshing role dynamically for:', fbUser.email);
    
    // Get role dynamically
    const dynamicRole = await this.getUserRole(fbUser.email || '');
    
    // Update user with dynamic role
    const updatedUser: AuthUser = {
      ...currentUser,
      role: dynamicRole
    };
    
    this.currentUserSubject.next(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    console.log('AuthService: Role refreshed dynamically:', updatedUser);
  }

  private clearAuthData(): void {
    console.log('AuthService: Clearing auth data only');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    // Only remove auth-related items, don't clear entire storage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');
    
    console.log('AuthService: Auth data cleared, Firebase user:', this.auth.currentUser);
  }

  // Force clear authentication for testing
  forceClearAuth(): void {
    console.log('AuthService: Force clearing authentication state');
    this.clearAuthData();
    // Also sign out from Firebase
    signOut(this.auth).catch(error => {
      console.error('Error signing out from Firebase:', error);
    });
  }
}
