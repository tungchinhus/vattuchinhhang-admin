// Script đơn giản để kiểm tra Firebase
// Chạy trong browser console khi đã đăng nhập Firebase

console.log('🔍 Kiểm tra Firebase data...');

// Kiểm tra permissions
firebase.firestore().collection('permissions').get()
  .then(snapshot => {
    console.log('📋 Permissions:', snapshot.size);
    if (snapshot.empty) {
      console.log('❌ Không có permissions nào!');
    } else {
      snapshot.forEach(doc => {
        console.log(`- ${doc.id}: ${doc.data().displayName}`);
      });
    }
  })
  .catch(error => {
    console.error('❌ Lỗi permissions:', error);
  });

// Kiểm tra roles
firebase.firestore().collection('roles').get()
  .then(snapshot => {
    console.log('👥 Roles:', snapshot.size);
    if (snapshot.empty) {
      console.log('❌ Không có roles nào!');
    } else {
      snapshot.forEach(doc => {
        console.log(`- ${doc.id}: ${doc.data().displayName}`);
      });
    }
  })
  .catch(error => {
    console.error('❌ Lỗi roles:', error);
  });

// Kiểm tra userRoles
firebase.firestore().collection('userRoles').get()
  .then(snapshot => {
    console.log('🔗 UserRoles:', snapshot.size);
    if (snapshot.empty) {
      console.log('❌ Không có userRoles nào!');
    } else {
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`- ${doc.id}: ${data.userId} -> ${data.roleId}`);
      });
    }
  })
  .catch(error => {
    console.error('❌ Lỗi userRoles:', error);
  });
