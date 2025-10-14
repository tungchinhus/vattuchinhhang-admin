const admin = require('firebase-admin');
const fs = require('fs');

// Khởi tạo Firebase Admin SDK
admin.initializeApp({
  projectId: 'vattuchinhhang-c5952'
});

const db = admin.firestore();

async function assignRoleToUser(userEmail, roleId, assignedByEmail = 'system') {
  try {
    console.log(`🔗 Đang gán role ${roleId} cho user ${userEmail}...`);
    
    // Tạo document ID unique
    const docId = `${userEmail.replace('@', '_').replace('.', '_')}_${roleId}`;
    
    const docRef = db.collection('userRoles').doc(docId);
    await docRef.set({
      userId: userEmail, // Hoặc có thể dùng UID nếu có
      roleId: roleId,
      assignedAt: admin.firestore.FieldValue.serverTimestamp(),
      assignedBy: assignedByEmail,
      isActive: true
    });
    
    console.log(`✅ Đã gán role ${roleId} cho ${userEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Lỗi khi gán role ${roleId} cho ${userEmail}:`, error.message);
    return false;
  }
}

async function createDefaultUserRoles() {
  try {
    console.log('🚀 Bắt đầu tạo user roles mặc định...');
    
    // Danh sách users và roles mặc định
    const defaultAssignments = [
      {
        userEmail: 'tungchinhus@gmail.com', // Super admin
        roleId: 'super_admin',
        assignedBy: 'system'
      },
      {
        userEmail: 'admin@example.com', // Admin example
        roleId: 'admin',
        assignedBy: 'tungchinhus@gmail.com'
      },
      {
        userEmail: 'manager@example.com', // Manager example
        roleId: 'manager',
        assignedBy: 'tungchinhus@gmail.com'
      }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const assignment of defaultAssignments) {
      const success = await assignRoleToUser(
        assignment.userEmail,
        assignment.roleId,
        assignment.assignedBy
      );
      
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }
    
    console.log('\n📊 Kết quả gán roles:');
    console.log(`✅ Thành công: ${successCount} assignments`);
    console.log(`❌ Lỗi: ${errorCount} assignments`);
    
    if (successCount > 0) {
      console.log('\n🎉 Gán roles hoàn tất!');
    }
    
  } catch (error) {
    console.error('❌ Lỗi chung:', error);
  } finally {
    process.exit(0);
  }
}

// Chạy function
createDefaultUserRoles();
