import { Injectable, Inject } from '@angular/core';
import { addDoc, collection, CollectionReference, DocumentData, Firestore } from 'firebase/firestore';
import { Product, ProductFormData } from '../models/product.model';
import { FIRESTORE } from '../firebase.tokens';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly collectionName = 'products';

  constructor(
    @Inject(FIRESTORE) private readonly db: Firestore
  ) {}

  async addProduct(form: ProductFormData): Promise<string> {
    const now = new Date();
    const data: Omit<Product, 'id'> = {
      ...form,
      createdAt: now,
      updatedAt: now
    } as Omit<Product, 'id'>;

    const colRef = collection(this.db, this.collectionName) as CollectionReference<DocumentData>;
    const docRef = await addDoc(colRef, data as DocumentData);
    return docRef.id;
  }
}


