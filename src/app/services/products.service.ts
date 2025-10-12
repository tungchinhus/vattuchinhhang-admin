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
import { Product, ProductFormData, ProductStatus } from '../models/product.model';
import { FIREBASE_AUTH, FIRESTORE } from '../firebase.tokens';
import type { Auth, User as FirebaseUser } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly collectionName = 'products';

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

  private static removeUndefinedDeep<T>(value: T): T {
    if (Array.isArray(value)) {
      const cleanedArray = (value as unknown[])
        .map(v => ProductsService.removeUndefinedDeep(v))
        .filter(v => v !== undefined);
      return cleanedArray as unknown as T;
    }
    if (value !== null && typeof value === 'object') {
      const result: Record<string, unknown> = {};
      const entries = Object.entries(value as Record<string, unknown>);
      for (const [key, val] of entries) {
        if (val === undefined) continue;
        const cleaned = ProductsService.removeUndefinedDeep(val);
        if (cleaned !== undefined) {
          result[key] = cleaned;
        }
      }
      return result as unknown as T;
    }
    return value;
  }

  async addProduct(form: ProductFormData): Promise<string> {
    try {
      const user = await this.waitForAuth();
      
      const data: Omit<Product, 'id'> = {
        ...form,
        createdAt: serverTimestamp() as unknown as Date
      } as Omit<Product, 'id'>;

      const colRef = collection(this.db, this.collectionName) as CollectionReference<DocumentData>;
      const docRef = await addDoc(colRef, data);
      return docRef.id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lưu sản phẩm lên Firestore: ${message}`);
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const colRef = collection(this.db, this.collectionName);
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lấy danh sách sản phẩm: ${message}`);
    }
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    try {
      const colRef = collection(this.db, this.collectionName);
      const q = query(colRef, where('sellerId', '==', sellerId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lấy sản phẩm của người bán: ${message}`);
    }
  }

  async getProductsByStatus(status: ProductStatus): Promise<Product[]> {
    try {
      const colRef = collection(this.db, this.collectionName);
      const q = query(colRef, where('status', '==', status), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lấy sản phẩm theo trạng thái: ${message}`);
    }
  }

  async updateProductStatus(productId: string, status: ProductStatus): Promise<void> {
    try {
      const productRef = doc(this.db, this.collectionName, productId);
      const updateData: any = { status };
      
      if (status === ProductStatus.APPROVED) {
        updateData.approvedAt = serverTimestamp();
      }
      
      await updateDoc(productRef, updateData);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể cập nhật trạng thái sản phẩm: ${message}`);
    }
  }

  async updateProduct(productId: string, form: Partial<ProductFormData>): Promise<void> {
    try {
      const productRef = doc(this.db, this.collectionName, productId);
      await updateDoc(productRef, form);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể cập nhật sản phẩm: ${message}`);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      const productRef = doc(this.db, this.collectionName, productId);
      await deleteDoc(productRef);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể xóa sản phẩm: ${message}`);
    }
  }
}


