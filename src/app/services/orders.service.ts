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
import { Order, OrderFormData, OrderStatus } from '../models/order.model';
import { FIREBASE_AUTH, FIRESTORE } from '../firebase.tokens';
import type { Auth, User as FirebaseUser } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly collectionName = 'orders';

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

  async addOrder(form: OrderFormData): Promise<string> {
    try {
      await this.waitForAuth();
      
      const data: Omit<Order, 'id'> = {
        ...form,
        createdAt: serverTimestamp() as unknown as Date
      } as Omit<Order, 'id'>;

      const colRef = collection(this.db, this.collectionName) as CollectionReference<DocumentData>;
      const docRef = await addDoc(colRef, data);
      return docRef.id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lưu đơn hàng lên Firestore: ${message}`);
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      const colRef = collection(this.db, this.collectionName);
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lấy danh sách đơn hàng: ${message}`);
    }
  }

  async getOrdersByBuyer(buyerId: string): Promise<Order[]> {
    try {
      const colRef = collection(this.db, this.collectionName);
      const q = query(colRef, where('buyerId', '==', buyerId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lấy đơn hàng của người mua: ${message}`);
    }
  }

  async getOrdersBySeller(sellerId: string): Promise<Order[]> {
    try {
      const colRef = collection(this.db, this.collectionName);
      const q = query(colRef, where('sellerId', '==', sellerId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể lấy đơn hàng của người bán: ${message}`);
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      const orderRef = doc(this.db, this.collectionName, orderId);
      await updateDoc(orderRef, { status });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể cập nhật trạng thái đơn hàng: ${message}`);
    }
  }

  async deleteOrder(orderId: string): Promise<void> {
    try {
      const orderRef = doc(this.db, this.collectionName, orderId);
      await deleteDoc(orderRef);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error';
      throw new Error(`Không thể xóa đơn hàng: ${message}`);
    }
  }
}
