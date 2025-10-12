import { Injectable, Inject } from '@angular/core';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';
import { FIREBASE_STORAGE } from '../firebase.tokens';

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  constructor(
    @Inject(FIREBASE_STORAGE) private readonly storage: FirebaseStorage
  ) {}

  async uploadUserAvatar(file: File, userId: string): Promise<string> {
    const timestamp = Date.now();
    const fileName = `profile_${timestamp}.${file.name.split('.').pop()}`;
    const imageRef = ref(this.storage, `users/avatars/${userId}/${fileName}`);
    
    try {
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading user avatar:', error);
      throw new Error('Không thể upload ảnh đại diện. Vui lòng thử lại!');
    }
  }

  async uploadProductImage(file: File, productId: string, imageIndex: number = 0): Promise<string> {
    const timestamp = Date.now();
    const fileName = `image_${imageIndex}_${timestamp}.${file.name.split('.').pop()}`;
    const imageRef = ref(this.storage, `products/${productId}/${fileName}`);
    
    try {
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw new Error('Không thể upload ảnh sản phẩm. Vui lòng thử lại!');
    }
  }

  async uploadMultipleProductImages(files: File[], productId: string): Promise<string[]> {
    const uploadPromises = files.map((file, index) => 
      this.uploadProductImage(file, productId, index)
    );
    
    try {
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error uploading multiple product images:', error);
      throw new Error('Không thể upload một số ảnh sản phẩm. Vui lòng thử lại!');
    }
  }

  async uploadCategoryIcon(file: File, categoryId: string): Promise<string> {
    const timestamp = Date.now();
    const fileName = `icon_${timestamp}.${file.name.split('.').pop()}`;
    const imageRef = ref(this.storage, `categories/${categoryId}/${fileName}`);
    
    try {
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading category icon:', error);
      throw new Error('Không thể upload icon danh mục. Vui lòng thử lại!');
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
