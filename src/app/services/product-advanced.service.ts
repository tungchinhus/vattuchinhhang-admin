import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Firestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, limit } from 'firebase/firestore';
import { ProductDoc } from '../models/product-advanced.model';

@Injectable({ providedIn: 'root' })
export class ProductAdvancedService {
  private readonly db: Firestore;
  private readonly COLLECTION = 'products';

  constructor(private firebase: FirebaseService) {
    this.db = this.firebase.getFirestore();
  }

  async listProducts(limitCount?: number): Promise<ProductDoc[]> {
    const base = collection(this.db, this.COLLECTION);
    const q = limitCount ? query(base, orderBy('updated_at', 'desc'), limit(limitCount)) : query(base, orderBy('updated_at', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }

  async getProductById(productId: string): Promise<ProductDoc | null> {
    const ref = doc(this.db, this.COLLECTION, productId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as any) };
  }

  async getProductBySlug(slug: string): Promise<ProductDoc | null> {
    const q = query(collection(this.db, this.COLLECTION), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...(d.data() as any) };
  }

  async createProduct(data: Omit<ProductDoc, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const ref = await addDoc(collection(this.db, this.COLLECTION), {
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    } as any);
    return ref.id;
  }

  async updateProduct(id: string, data: Partial<ProductDoc>): Promise<void> {
    const ref = doc(this.db, this.COLLECTION, id);
    await updateDoc(ref, { ...data, updated_at: serverTimestamp() } as any);
  }

  async deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(this.db, this.COLLECTION, id));
  }
}


