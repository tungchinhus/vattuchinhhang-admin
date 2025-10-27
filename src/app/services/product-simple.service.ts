import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Firestore, collection, doc, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, limit } from 'firebase/firestore';
import { ProductSimple } from '../models/product-simple.model';

@Injectable({
  providedIn: 'root'
})
export class ProductSimpleService {
  private readonly db: Firestore;
  private readonly COLLECTION = 'products';

  constructor(private firebase: FirebaseService) {
    this.db = this.firebase.getFirestore();
  }

  /**
   * Get all products
   */
  async listProducts(limitCount?: number): Promise<ProductSimple[]> {
    const base = collection(this.db, this.COLLECTION);
    const q = limitCount 
      ? query(base, orderBy('created_at', 'desc'), limit(limitCount)) 
      : query(base, orderBy('created_at', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ product_id: d.id, ...(d.data() as any) })) as ProductSimple[];
  }

  /**
   * Get a product by ID
   */
  async getProductById(productId: string): Promise<ProductSimple | null> {
    const ref = doc(this.db, this.COLLECTION, productId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { product_id: snap.id, ...(snap.data() as any) } as ProductSimple;
  }

  /**
   * Get a product by slug
   */
  async getProductBySlug(slug: string): Promise<ProductSimple | null> {
    const q = query(collection(this.db, this.COLLECTION), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { product_id: d.id, ...(d.data() as any) } as ProductSimple;
  }

  /**
   * Create a new product
   */
  async createProduct(data: Omit<ProductSimple, 'created_at' | 'updated_at'>): Promise<string> {
    // Use product_id as document ID to match the JSON structure
    const docRef = doc(this.db, this.COLLECTION, data.product_id);
    
    await setDoc(docRef, {
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    } as any);
    
    return data.product_id;
  }

  /**
   * Update an existing product
   */
  async updateProduct(productId: string, data: Partial<ProductSimple>): Promise<void> {
    const ref = doc(this.db, this.COLLECTION, productId);
    await updateDoc(ref, { 
      ...data, 
      updated_at: serverTimestamp() 
    } as any);
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: string): Promise<void> {
    await deleteDoc(doc(this.db, this.COLLECTION, productId));
  }

  /**
   * Check if product_id already exists
   */
  async checkProductIdExists(productId: string): Promise<boolean> {
    const q = query(collection(this.db, this.COLLECTION), where('product_id', '==', productId), limit(1));
    const snap = await getDocs(q);
    return !snap.empty;
  }

  /**
   * Check if slug already exists
   */
  async checkSlugExists(slug: string): Promise<boolean> {
    const q = query(collection(this.db, this.COLLECTION), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    return !snap.empty;
  }
}

