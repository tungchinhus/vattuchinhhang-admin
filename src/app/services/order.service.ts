import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Firestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { Order, OrderStatus } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly db: Firestore;

  constructor(private firebase: FirebaseService) {
    this.db = this.firebase.getFirestore();
  }

  private customerOrdersPath(customerId: string) {
    return `users/${customerId}/orders`;
  }

  async listOrdersByCustomer(customerId: string, status?: OrderStatus): Promise<Order[]> {
    const baseCol = collection(this.db, this.customerOrdersPath(customerId));
    const q = status ? query(baseCol, where('status', '==', status), orderBy('createdAt', 'desc')) : query(baseCol, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => this.mapOrder(d.id, customerId, d.data()));
  }

  async getOrder(customerId: string, orderId: string): Promise<Order | null> {
    const ref = doc(this.db, this.customerOrdersPath(customerId), orderId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return this.mapOrder(snap.id, customerId, snap.data());
  }

  async createOrder(customerId: string, data: Omit<Order, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ref = await addDoc(collection(this.db, this.customerOrdersPath(customerId)), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as any);
    return ref.id;
  }

  async updateOrder(customerId: string, orderId: string, data: Partial<Order>): Promise<void> {
    const ref = doc(this.db, this.customerOrdersPath(customerId), orderId);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() } as any);
  }

  async deleteOrder(customerId: string, orderId: string): Promise<void> {
    await deleteDoc(doc(this.db, this.customerOrdersPath(customerId), orderId));
  }

  private mapOrder(id: string, customerId: string, data: any): Order {
    return {
      id,
      customerId,
      items: data.items || [],
      total: data.total ?? 0,
      status: data.status as OrderStatus,
      createdAt: this.toDate(data.createdAt),
      updatedAt: this.toDate(data.updatedAt),
    };
  }

  private toDate(ts: any): Date | any {
    if (!ts) return ts;
    if (typeof ts.toDate === 'function') return ts.toDate();
    if (ts instanceof Date) return ts;
    return new Date(ts);
  }
}


