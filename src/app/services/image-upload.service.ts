import { Injectable, Inject } from '@angular/core';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';
import { FIREBASE_STORAGE } from '../firebase.tokens';

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  private readonly storagePath = 'products';

  constructor(
    @Inject(FIREBASE_STORAGE) private readonly storage: FirebaseStorage
  ) {}

  async uploadImage(file: File, productId: string, imageIndex: number = 0): Promise<string> {
    const timestamp = Date.now();
    const fileName = `${productId}_${imageIndex}_${timestamp}.${file.name.split('.').pop()}`;
    const imageRef = ref(this.storage, `${this.storagePath}/${fileName}`);
    
    try {
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Không thể upload ảnh. Vui lòng thử lại!');
    }
  }

  async uploadMultipleImages(files: File[], productId: string): Promise<string[]> {
    const uploadPromises = files.map((file, index) => 
      this.uploadImage(file, productId, index)
    );
    
    try {
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw new Error('Không thể upload một số ảnh. Vui lòng thử lại!');
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(this.storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      // Không throw error vì có thể ảnh đã bị xóa hoặc không tồn tại
    }
  }

  async deleteMultipleImages(imageUrls: string[]): Promise<void> {
    const deletePromises = imageUrls.map(url => this.deleteImage(url));
    await Promise.allSettled(deletePromises);
  }
}
