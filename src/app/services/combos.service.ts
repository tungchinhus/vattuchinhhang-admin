import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Firestore, collection, addDoc, getDocs } from 'firebase/firestore';

export interface ComboItemRef { productId: string; quantity: number; }
export interface Combo {
  id?: string;
  name: string;
  description: string;
  products: ComboItemRef[];
  price: number;
  discountPrice?: number | null;
  imageURL: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({ providedIn: 'root' })
export class CombosService {
  private readonly db: Firestore;
  private readonly COLLECTION = 'combos';

  constructor(private firebase: FirebaseService) {
    this.db = this.firebase.getFirestore();
  }

  async createCombo(data: Omit<Combo, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(this.db, this.COLLECTION), { ...data, createdAt: now, updatedAt: now });
    return docRef.id;
  }

  async listCombos(): Promise<Combo[]> {
    const snap = await getDocs(collection(this.db, this.COLLECTION));
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }
}


