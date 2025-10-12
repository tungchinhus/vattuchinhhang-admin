import { Injectable, Inject } from '@angular/core';
import { 
  addDoc, 
  collection, 
  CollectionReference, 
  DocumentData, 
  Firestore, 
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { Category, CategoryFormData } from '../models/category.model';
import { FIREBASE_AUTH, FIRESTORE } from '../firebase.tokens';
import type { Auth, User as FirebaseUser } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly collectionName = 'categories';

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

  async addCategory(form: CategoryFormData): Promise<string> {
    try {
      await this.waitForAuth();
      
      const data: Omit<Category, 'id'> = {
        ...form
      } as Omit<Category, 'id'>;

      const colRef = collection(this.db, this.collectionName) as CollectionReference<DocumentData>;
      const docRef = await addDoc(colRef, data);
      return docRef.id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lưu danh mục lên Firestore: ${message}`);
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const colRef = collection(this.db, this.collectionName);
      const q = query(colRef, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lấy danh sách danh mục: ${message}`);
    }
  }

  async updateCategory(categoryId: string, form: Partial<CategoryFormData>): Promise<void> {
    try {
      const categoryRef = doc(this.db, this.collectionName, categoryId);
      await updateDoc(categoryRef, form);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể cập nhật danh mục: ${message}`);
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    try {
      const categoryRef = doc(this.db, this.collectionName, categoryId);
      await deleteDoc(categoryRef);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể xóa danh mục: ${message}`);
    }
  }
}
