import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Firestore, collection, getDocs } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { Permission } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permissionsSubject = new BehaviorSubject<Permission[]>([]);
  public permissions$ = this.permissionsSubject.asObservable();

  constructor(private firebaseService: FirebaseService) {
    this.loadPermissions();
  }

  private async loadPermissions(): Promise<void> {
    try {
      console.log('🔄 Đang load permissions từ Firebase...');
      
      const firestore = this.firebaseService.getFirestore();
      console.log('📡 Firestore instance:', firestore);
      
      const permissionsRef = collection(firestore, 'permissions');
      console.log('📋 Permissions reference:', permissionsRef);
      
      const snapshot = await getDocs(permissionsRef);
      console.log('📊 Snapshot:', snapshot);
      console.log('📊 Snapshot size:', snapshot.size);
      console.log('📊 Snapshot empty:', snapshot.empty);
      
      if (snapshot.empty) {
        console.log('⚠️ Collection permissions trống!');
        this.permissionsSubject.next([]);
        return;
      }
      
      const permissions = snapshot.docs.map((doc: any) => {
        const data = doc.data();
        console.log('📄 Document:', doc.id, data);
        return {
          id: doc.id,
          name: data['name'] || doc.id,
          displayName: data['displayName'] || doc.id,
          description: data['description'] || '',
          module: data['module'] || '',
          action: data['action'] || '',
          isActive: data['isActive'] !== undefined ? data['isActive'] : true
        } as Permission;
      });

      console.log('✅ Đã load được permissions:', permissions);
      this.permissionsSubject.next(permissions);
      
    } catch (error) {
      console.error('❌ Lỗi khi load permissions:', error);
      console.error('❌ Error details:', error);
      this.permissionsSubject.next([]);
    }
  }

  getPermissions(): Observable<Permission[]> {
    return this.permissions$;
  }

  refreshPermissions(): void {
    this.loadPermissions();
  }
}
