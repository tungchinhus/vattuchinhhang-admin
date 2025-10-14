import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Firebase config (thay đổi theo project của bạn)
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Thay bằng API key thực
  authDomain: "vattuchinhhang-c5952.firebaseapp.com",
  projectId: "vattuchinhhang-c5952",
  storageBucket: "vattuchinhhang-c5952.appspot.com",
  messagingSenderId: "59321878286",
  appId: "1:59321878286:web:..." // Thay bằng app ID thực
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkFirebaseData() {
  try {
    console.log('🔍 Đang kiểm tra Firebase data...');
    
    // 1. Kiểm tra collection permissions
    console.log('\n📋 Kiểm tra collection permissions:');
    const permissionsRef = collection(db, 'permissions');
    const permissionsSnapshot = await getDocs(permissionsRef);
    
    if (permissionsSnapshot.empty) {
      console.log('❌ Collection permissions trống!');
    } else {
      console.log(`✅ Tìm thấy ${permissionsSnapshot.size} permissions:`);
      permissionsSnapshot.forEach(doc => {
        console.log(`- ${doc.id}: ${doc.data().displayName || doc.id}`);
      });
    }
    
    // 2. Kiểm tra collection roles
    console.log('\n👥 Kiểm tra collection roles:');
    const rolesRef = collection(db, 'roles');
    const rolesSnapshot = await getDocs(rolesRef);
    
    if (rolesSnapshot.empty) {
      console.log('❌ Collection roles trống!');
    } else {
      console.log(`✅ Tìm thấy ${rolesSnapshot.size} roles:`);
      rolesSnapshot.forEach(doc => {
        console.log(`- ${doc.id}: ${doc.data().displayName || doc.id}`);
      });
    }
    
    // 3. Kiểm tra collection userRoles
    console.log('\n🔗 Kiểm tra collection userRoles:');
    const userRolesRef = collection(db, 'userRoles');
    const userRolesSnapshot = await getDocs(userRolesRef);
    
    if (userRolesSnapshot.empty) {
      console.log('❌ Collection userRoles trống!');
    } else {
      console.log(`✅ Tìm thấy ${userRolesSnapshot.size} user roles:`);
      userRolesSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`- ${doc.id}: ${data.userId} -> ${data.roleId}`);
      });
    }
    
    // 4. Kiểm tra user tungchinhus@gmail.com
    console.log('\n👤 Kiểm tra user tungchinhus@gmail.com:');
    const userRolesForTung = userRolesSnapshot.docs.filter(doc => 
      doc.data().userId === 'tungchinhus@gmail.com'
    );
    
    if (userRolesForTung.length === 0) {
      console.log('❌ Không tìm thấy roles cho tungchinhus@gmail.com');
    } else {
      console.log(`✅ Tìm thấy ${userRolesForTung.length} roles cho tungchinhus@gmail.com:`);
      userRolesForTung.forEach(doc => {
        const data = doc.data();
        console.log(`- Role: ${data.roleId}, Active: ${data.isActive}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra Firebase:', error);
  }
}

checkFirebaseData();
