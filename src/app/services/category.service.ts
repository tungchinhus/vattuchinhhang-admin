import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Firestore, collection, getDocs, query, where, limit } from 'firebase/firestore';
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
}


