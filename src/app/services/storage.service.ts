import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { FirebaseStorage } from 'firebase/storage';
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly storage: FirebaseStorage;

  constructor(private firebase: FirebaseService) {
    this.storage = this.firebase.getStorage();
  }

  /**
   * Upload file to Firebase Storage
   * @param file - File to upload
   * @param path - Path in storage (e.g., 'products/images')
   * @param fileName - Optional custom file name
   * @returns Promise with download URL
   */
  async uploadFile(file: File, path: string, fileName?: string): Promise<string> {
    try {
      const timestamp = new Date().getTime();
      const extension = file.name.split('.').pop();
      const finalFileName = fileName || `${timestamp}.${extension}`;
      const fileRef = ref(this.storage, `${path}/${finalFileName}`);

      // Upload file
      const snapshot = await uploadBytes(fileRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('File uploaded successfully:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Upload file with progress tracking
   * @param file - File to upload
   * @param path - Path in storage
   * @param fileName - Optional custom file name
   * @returns Upload task with progress
   */
  uploadFileWithProgress(file: File, path: string, fileName?: string) {
    const timestamp = new Date().getTime();
    const extension = file.name.split('.').pop();
    const finalFileName = fileName || `${timestamp}.${extension}`;
    const fileRef = ref(this.storage, `${path}/${finalFileName}`);

    // Upload file with progress tracking
    const uploadTask = uploadBytesResumable(fileRef, file);

    return {
      task: uploadTask,
      downloadURL: uploadTask.then(() => getDownloadURL(uploadTask.snapshot.ref))
    };
  }

  /**
   * Upload multiple files
   * @param files - Array of files to upload
   * @param path - Path in storage
   * @returns Promise with array of download URLs
   */
  async uploadMultipleFiles(files: File[], path: string): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, path));
    return Promise.all(uploadPromises);
  }
}

