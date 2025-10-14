import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Firestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, collectionGroup, limit } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Product, ProductStatus, Review, Category } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly db: Firestore;

  constructor(private firebase: FirebaseService) {
    this.db = this.firebase.getFirestore();
  }

  // ============== Categories ==============
  async listCategories(): Promise<Category[]> {
    const snap = await getDocs(collection(this.db, 'categories'));
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any), createdAt: this.toDate((d.data() as any).createdAt) }));
  }

  async createCategory(data: Omit<Category, 'id' | 'createdAt'>): Promise<string> {
    const ref = await addDoc(collection(this.db, 'categories'), {
      ...data,
      createdAt: serverTimestamp()
    } as any);
    return ref.id;
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<void> {
    await updateDoc(doc(this.db, 'categories', id), data as any);
  }

  async deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(this.db, 'categories', id));
  }

  // ============== Products ==============
  private supplierProductsPath(supplierId: string) {
    return `users/${supplierId}/products`;
  }

  async listProductsBySupplier(supplierId: string, status?: ProductStatus): Promise<Product[]> {
    const baseCol = collection(this.db, this.supplierProductsPath(supplierId));
    const q = status ? query(baseCol, where('status', '==', status), orderBy('createdAt', 'desc')) : query(baseCol, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => this.mapProduct(d.id, supplierId, d.data())) as Product[];
  }

  async getProduct(supplierId: string, productId: string): Promise<Product | null> {
    const ref = doc(this.db, this.supplierProductsPath(supplierId), productId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return this.mapProduct(snap.id, supplierId, snap.data());
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    // Search across all suppliers via collection group
    const q = query(collectionGroup(this.db, 'products'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    // Extract supplierId from path: users/{supplierId}/products/{productId}
    const segments = d.ref.path.split('/');
    const supplierIndex = segments.indexOf('users') + 1;
    const supplierId = segments[supplierIndex];
    return this.mapProduct(d.id, supplierId, d.data());
  }

  async createProduct(supplierId: string, data: Omit<Product, 'id' | 'supplierId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ref = await addDoc(collection(this.db, this.supplierProductsPath(supplierId)), {
      ...data,
      status: data.status || 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    } as any);
    return ref.id;
  }

  async updateProduct(supplierId: string, productId: string, data: Partial<Product>): Promise<void> {
    const ref = doc(this.db, this.supplierProductsPath(supplierId), productId);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() } as any);
  }

  async deleteProduct(supplierId: string, productId: string): Promise<void> {
    await deleteDoc(doc(this.db, this.supplierProductsPath(supplierId), productId));
  }

  // Global listing by status across suppliers requires an index/aggregation. For admin queue, we can store supplierId in product documents or query per supplier list.

  // ============== Reviews ==============
  private productReviewsPath(supplierId: string, productId: string) {
    return `users/${supplierId}/products/${productId}/reviews`;
  }

  async listReviews(supplierId: string, productId: string): Promise<Review[]> {
    const snap = await getDocs(collection(this.db, this.productReviewsPath(supplierId, productId)));
    return snap.docs.map(d => ({ id: d.id, supplierId, productId, ...(d.data() as any), createdAt: this.toDate((d.data() as any).createdAt) }));
  }

  // ============== Helpers ==============
  private mapProduct(id: string, supplierId: string, data: any): Product {
    return {
      id,
      supplierId,
      name: data.name,
      slug: data.slug,
      description: data.description || data.shortDescription || data.fullDescription || '',
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      price: data.price,
      images: data.images || [],
      category: data.category,
      specs: data.specs,
      stock: data.stock ?? 0,
      status: data.status as ProductStatus,
      adminReview: data.adminReview ? {
        reviewedBy: data.adminReview.reviewedBy,
        reviewedAt: this.toDate(data.adminReview.reviewedAt),
        note: data.adminReview.note,
      } : undefined,
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


