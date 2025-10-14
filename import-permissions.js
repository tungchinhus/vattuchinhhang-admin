const admin = require('firebase-admin');
const fs = require('fs');

// Khởi tạo Firebase Admin SDK
// Bạn cần tải service account key từ Firebase Console
// Project Settings > Service Accounts > Generate new private key
const serviceAccount = require('./serviceAccountKey.json'); // Thay đổi đường dẫn này

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vattuchinhhang-c5952.firebaseio.com" // Thay đổi URL này
});

const db = admin.firestore();

async function importPermissions() {
  try {
    console.log('Bắt đầu import permissions...');
    
    // Đọc file permissions.json
    const permissionsData = JSON.parse(fs.readFileSync('./permissions.json', 'utf8'));
    
    const batch = db.batch();
    let count = 0;
    
    // Import từng permission
    for (const [permissionId, permissionData] of Object.entries(permissionsData.permissions)) {
      const docRef = db.collection('permissions').doc(permissionId);
      batch.set(docRef, {
        ...permissionData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      count++;
    }
    
    // Commit batch
    await batch.commit();
    
    console.log(`✅ Đã import thành công ${count} permissions vào Firebase!`);
    console.log('Các permissions đã được thêm:');
    
    // Liệt kê các permissions đã thêm
    for (const permissionId of Object.keys(permissionsData.permissions)) {
      console.log(`- ${permissionId}: ${permissionsData.permissions[permissionId].displayName}`);
    }
    
  } catch (error) {
    console.error('❌ Lỗi khi import permissions:', error);
  } finally {
    process.exit(0);
  }
}

importPermissions();
