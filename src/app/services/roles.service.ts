import { Injectable, Inject } from '@angular/core';
import { 
  collection, 
  CollectionReference, 
  DocumentData, 
  Firestore, 
  serverTimestamp,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { UserRole } from '../models/user.model';
import { FIREBASE_AUTH, FIRESTORE } from '../firebase.tokens';
import type { Auth, User as FirebaseUser } from 'firebase/auth';

export interface RoleAssignment {
  id?: string;
  userId: string;
  email: string;
  role: UserRole;
  assignedBy: string;
  assignedAt: Date;
  reason?: string;
}

export interface RoleChangeRequest {
  id?: string;
  userId: string;
  email: string;
  currentRole: UserRole;
  requestedRole: UserRole;
  requestedBy: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly rolesCollection = 'role_assignments';
  private readonly requestsCollection = 'role_change_requests';
  private readonly bootstrapCollection = 'bootstrap';

  constructor(
    @Inject(FIRESTORE) private readonly db: Firestore,
    @Inject(FIREBASE_AUTH) private readonly auth: Auth
  ) {}

  private async waitForAuth(): Promise<FirebaseUser> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        unsubscribe();
        if (user && user.uid) {
          resolve(user);
        } else {
          reject(new Error('Không thể xác thực người dùng. Vui lòng đăng nhập lại.'));
        }
      });
    });
  }

  // Get user role from role assignments
  async getUserRole(userId: string): Promise<UserRole | null> {
    try {
      const colRef = collection(this.db, this.rolesCollection);
      const q = query(colRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('RolesService: No role assignment found for user:', userId);
        return null;
      }
      
      const roleDoc = querySnapshot.docs[0];
      const roleData = roleDoc.data() as RoleAssignment;
      return roleData.role;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      console.error('Error getting user role:', message);
      return null;
    }
  }

  // Get user role by email
  async getUserRoleByEmail(email: string): Promise<UserRole | null> {
    try {
      const colRef = collection(this.db, this.rolesCollection);
      const q = query(colRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('RolesService: No role assignment found for email:', email);
        return null;
      }
      
      const roleDoc = querySnapshot.docs[0];
      const roleData = roleDoc.data() as RoleAssignment;
      return roleData.role;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      console.error('Error getting user role by email:', message);
      return null;
    }
  }

  // SPECIAL METHOD: Bootstrap first super admin (bypasses permission check)
  async bootstrapFirstSuperAdmin(email: string, reason?: string): Promise<string> {
    try {
      const currentUser = await this.waitForAuth();
      
      // Create user document with super_admin role (this bypasses permission check)
      const userData = {
        name: currentUser.displayName || email,
        email: email,
        role: UserRole.SUPER_ADMIN,
        avatarUrl: currentUser.photoURL || '',
        createdAt: serverTimestamp()
      };

      const usersRef = collection(this.db, 'users') as CollectionReference<DocumentData>;
      const userDocRef = await addDoc(usersRef, userData);
      
      console.log('RolesService: Super admin user created successfully:', userData);
      
      // Also create role assignment for consistency
      const roleAssignment: Omit<RoleAssignment, 'id'> = {
        userId: currentUser.uid,
        email: email,
        role: UserRole.SUPER_ADMIN,
        assignedBy: currentUser.uid,
        assignedAt: serverTimestamp() as unknown as Date,
        reason: reason || 'Bootstrap first super admin'
      };

      const colRef = collection(this.db, this.rolesCollection) as CollectionReference<DocumentData>;
      const docRef = await addDoc(colRef, roleAssignment);
      
      console.log('RolesService: Role assignment created successfully:', roleAssignment);
      return docRef.id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể bootstrap super admin đầu tiên: ${message}`);
    }
  }

  // Assign role to user (normal method with permission check)
  async assignRole(userId: string, email: string, role: UserRole, reason?: string): Promise<string> {
    try {
      const currentUser = await this.waitForAuth();
      
      // Remove existing role assignment
      await this.removeRoleAssignment(userId);
      
      const roleAssignment: Omit<RoleAssignment, 'id'> = {
        userId,
        email,
        role,
        assignedBy: currentUser.uid,
        assignedAt: serverTimestamp() as unknown as Date,
        reason
      };

      const colRef = collection(this.db, this.rolesCollection) as CollectionReference<DocumentData>;
      const docRef = await addDoc(colRef, roleAssignment);
      
      console.log('RolesService: Role assigned successfully:', roleAssignment);
      return docRef.id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể gán vai trò: ${message}`);
    }
  }

  // Remove role assignment
  async removeRoleAssignment(userId: string): Promise<void> {
    try {
      const colRef = collection(this.db, this.rolesCollection);
      const q = query(colRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      for (const docSnapshot of querySnapshot.docs) {
        await deleteDoc(docSnapshot.ref);
      }
      
      console.log('RolesService: Role assignment removed for user:', userId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      console.error('Error removing role assignment:', message);
    }
  }

  // Get all role assignments
  async getAllRoleAssignments(): Promise<RoleAssignment[]> {
    try {
      const colRef = collection(this.db, this.rolesCollection);
      const q = query(colRef, orderBy('assignedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as RoleAssignment));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lấy danh sách phân quyền: ${message}`);
    }
  }

  // Request role change
  async requestRoleChange(userId: string, email: string, currentRole: UserRole, requestedRole: UserRole, reason?: string): Promise<string> {
    try {
      const currentUser = await this.waitForAuth();
      
      const request: Omit<RoleChangeRequest, 'id'> = {
        userId,
        email,
        currentRole,
        requestedRole,
        requestedBy: currentUser.uid,
        requestedAt: serverTimestamp() as unknown as Date,
        status: 'pending',
        reason
      };

      const colRef = collection(this.db, this.requestsCollection) as CollectionReference<DocumentData>;
      const docRef = await addDoc(colRef, request);
      
      console.log('RolesService: Role change request created:', request);
      return docRef.id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể tạo yêu cầu thay đổi vai trò: ${message}`);
    }
  }

  // Get pending role change requests
  async getPendingRoleChangeRequests(): Promise<RoleChangeRequest[]> {
    try {
      const colRef = collection(this.db, this.requestsCollection);
      const q = query(colRef, where('status', '==', 'pending'), orderBy('requestedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as RoleChangeRequest));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lấy danh sách yêu cầu thay đổi vai trò: ${message}`);
    }
  }

  // Approve role change request
  async approveRoleChangeRequest(requestId: string): Promise<void> {
    try {
      const currentUser = await this.waitForAuth();
      
      // Get the request
      const requestRef = doc(this.db, this.requestsCollection, requestId);
      const requestSnapshot = await getDoc(requestRef);
      
      if (!requestSnapshot.exists()) {
        throw new Error('Yêu cầu không tồn tại');
      }
      
      const requestData = requestSnapshot.data() as RoleChangeRequest;
      
      // Update request status
      await updateDoc(requestRef, {
        status: 'approved',
        reviewedBy: currentUser.uid,
        reviewedAt: serverTimestamp()
      });
      
      // Assign new role
      await this.assignRole(
        requestData.userId, 
        requestData.email, 
        requestData.requestedRole,
        `Approved role change request: ${requestData.reason || 'No reason provided'}`
      );
      
      console.log('RolesService: Role change request approved:', requestId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể phê duyệt yêu cầu thay đổi vai trò: ${message}`);
    }
  }

  // Reject role change request
  async rejectRoleChangeRequest(requestId: string): Promise<void> {
    try {
      const currentUser = await this.waitForAuth();
      
      const requestRef = doc(this.db, this.requestsCollection, requestId);
      await updateDoc(requestRef, {
        status: 'rejected',
        reviewedBy: currentUser.uid,
        reviewedAt: serverTimestamp()
      });
      
      console.log('RolesService: Role change request rejected:', requestId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể từ chối yêu cầu thay đổi vai trò: ${message}`);
    }
  }

  // Get role statistics
  async getRoleStatistics(): Promise<Record<UserRole, number>> {
    try {
      const assignments = await this.getAllRoleAssignments();
      const stats: Record<UserRole, number> = {
        [UserRole.SUPER_ADMIN]: 0,
        [UserRole.ADMIN]: 0,
        [UserRole.SELLER]: 0,
        [UserRole.CUSTOMER]: 0
      };
      
      assignments.forEach(assignment => {
        stats[assignment.role]++;
      });
      
      return stats;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lấy thống kê vai trò: ${message}`);
    }
  }

  // Convert bootstrap request to role assignment (manual process)
  async convertBootstrapToRoleAssignment(bootstrapId: string): Promise<string> {
    try {
      const currentUser = await this.waitForAuth();
      
      // Get bootstrap request
      const bootstrapRef = doc(this.db, this.bootstrapCollection, bootstrapId);
      const bootstrapSnapshot = await getDoc(bootstrapRef);
      
      if (!bootstrapSnapshot.exists()) {
        throw new Error('Bootstrap request không tồn tại');
      }
      
      const bootstrapData = bootstrapSnapshot.data();
      
      // Create role assignment
      const roleAssignment: Omit<RoleAssignment, 'id'> = {
        userId: bootstrapData['userId'],
        email: bootstrapData['email'],
        role: bootstrapData['role'],
        assignedBy: bootstrapData['assignedBy'],
        assignedAt: bootstrapData['assignedAt'],
        reason: bootstrapData['reason']
      };

      const colRef = collection(this.db, this.rolesCollection) as CollectionReference<DocumentData>;
      const docRef = await addDoc(colRef, roleAssignment);
      
      // Clean up bootstrap request
      await deleteDoc(bootstrapRef);
      
      console.log('RolesService: Bootstrap converted to role assignment successfully:', roleAssignment);
      return docRef.id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể convert bootstrap: ${message}`);
    }
  }

  // Check if user is first time setup (no role assignments exist)
  async isFirstTimeSetup(): Promise<boolean> {
    try {
      // Try to read from bootstrap collection instead of role_assignments
      const bootstrapRef = collection(this.db, this.bootstrapCollection);
      const querySnapshot = await getDocs(bootstrapRef);
      
      // If bootstrap collection is empty, it's first time setup
      return querySnapshot.empty;
    } catch (error: unknown) {
      console.error('Error checking first time setup:', error);
      return true; // Assume first time if error
    }
  }
}