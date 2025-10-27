import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Firestore, collection, getDocs, query, where, limit, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Category } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly db: Firestore;

  constructor(private firebase: FirebaseService) {
    this.db = this.firebase.getFirestore();
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const q = query(collection(this.db, 'categories'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...(d.data() as any) } as Category;
  }

  async listCategories(): Promise<Category[]> {
    const snap = await getDocs(collection(this.db, 'categories'));
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Category));
  }

  async createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const ref = await addDoc(collection(this.db, 'categories'), { ...data, createdAt: now, updatedAt: now });
    return ref.id;
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<void> {
    const ref = doc(this.db, 'categories', id);
    await updateDoc(ref, { ...data, updatedAt: new Date() } as any);
  }

  async deleteCategory(id: string): Promise<void> {
    const ref = doc(this.db, 'categories', id);
    await deleteDoc(ref);
  }
}


