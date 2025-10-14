const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, serverTimestamp } = require('firebase/firestore');
const fs = require('fs');

// Cấu hình Firebase (thay đổi theo project của bạn)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "vattuchinhhang-c5952.firebaseapp.com",
  projectId: "vattuchinhhang-c5952",
  storageBucket: "vattuchinhhang-c5952.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importPermissions() {
  try {
    console.log('🚀 Bắt đầu import permissions...');
    
    // Đọc file permissions.json
    const permissionsData = JSON.parse(fs.readFileSync('./permissions.json', 'utf8'));
    
    let successCount = 0;
    let errorCount = 0;
    
    // Import từng permission
    for (const [permissionId, permissionData] of Object.entries(permissionsData.permissions)) {
      try {
        const docRef = doc(db, 'permissions', permissionId);
        await setDoc(docRef, {
          ...permissionData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        console.log(`✅ ${permissionId}: ${permissionData.displayName}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Lỗi khi import ${permissionId}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Kết quả import:');
    console.log(`✅ Thành công: ${successCount} permissions`);
    console.log(`❌ Lỗi: ${errorCount} permissions`);
    
    if (successCount > 0) {
      console.log('\n🎉 Import hoàn tất! Kiểm tra Firebase Console để xem kết quả.');
    }
    
  } catch (error) {
    console.error('❌ Lỗi chung:', error);
  } finally {
    process.exit(0);
  }
}

importPermissions();
