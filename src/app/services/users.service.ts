import { Injectable, Inject } from '@angular/core';
import { 
  addDoc, 
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
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { User, UserFormData, UserRole } from '../models/user.model';
import { FIREBASE_AUTH, FIRESTORE } from '../firebase.tokens';
import type { Auth, User as FirebaseUser } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly collectionName = 'users';

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

  async addUser(form: UserFormData): Promise<string> {
    try {
      const user = await this.waitForAuth();
      
      const data: Omit<User, 'id'> = {
        ...form,
        createdAt: serverTimestamp() as unknown as Date
      } as Omit<User, 'id'>;

      const colRef = collection(this.db, this.collectionName) as CollectionReference<DocumentData>;
      const docRef = await addDoc(colRef, data);
      return docRef.id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lưu người dùng lên Firestore: ${message}`);
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const colRef = collection(this.db, this.collectionName);
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lấy danh sách người dùng: ${message}`);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const colRef = collection(this.db, this.collectionName);
      const q = query(colRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('UsersService: User not found with email:', email);
        return null;
      }
      
      const userDoc = querySnapshot.docs[0];
      return {
        id: userDoc.id,
        ...userDoc.data()
      } as User;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      console.error('Error getting user by email:', message);
      return null; // Return null instead of throwing to allow fallback
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDocRef = doc(this.db, this.collectionName, userId);
      const userSnapshot = await getDoc(userDocRef);
      
      if (!userSnapshot.exists()) {
        console.log('UsersService: User not found in Firestore:', userId);
        return null;
      }
      
      const userData = userSnapshot.data();
      return {
        id: userId,
        ...userData
      } as User;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      console.error('Error getting user by ID:', message);
      return null; // Return null instead of throwing to allow fallback
    }
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      const colRef = collection(this.db, this.collectionName);
      const q = query(colRef, where('role', '==', role), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lấy danh sách người dùng theo vai trò: ${message}`);
    }
  }

  async updateUser(userId: string, form: Partial<UserFormData>): Promise<void> {
    try {
      const userRef = doc(this.db, this.collectionName, userId);
      await updateDoc(userRef, form);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể cập nhật người dùng: ${message}`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = doc(this.db, this.collectionName, userId);
      await deleteDoc(userRef);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể xóa người dùng: ${message}`);
    }
  }
}
