const admin = require('firebase-admin');
const fs = require('fs');

// Khởi tạo Firebase Admin SDK với service account
// Bạn cần tải service account key từ Firebase Console
// Project Settings > Service Accounts > Generate new private key

// Tạm thời sử dụng project ID để test
admin.initializeApp({
  projectId: 'vattuchinhhang-c5952'
});

const db = admin.firestore();

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
        const docRef = db.collection('permissions').doc(permissionId);
        await docRef.set({
          ...permissionData,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
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
