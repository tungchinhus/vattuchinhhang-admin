const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'vattuchinhhang-c5952'
});

const db = admin.firestore();

async function createSuperAdmin() {
  try {
    // Create role assignment
    const roleAssignment = {
      userId: '0JRc4NtwZTaeABl6Urx9jipwVyn2',
      email: 'tungchinhus@gmail.com',
      role: 'super_admin',
      assignedBy: '0JRc4NtwZTaeABl6Urx9jipwVyn2',
      assignedAt: admin.firestore.FieldValue.serverTimestamp(),
      reason: 'Manual bootstrap'
    };

    await db.collection('role_assignments').doc('0JRc4NtwZTaeABl6Urx9jipwVyn2').set(roleAssignment);
    console.log('✅ Super Admin role assignment created successfully!');

    // Also create user document
    const userData = {
      id: '0JRc4NtwZTaeABl6Urx9jipwVyn2',
      name: 'Chinh Do',
      email: 'tungchinhus@gmail.com',
      role: 'super_admin',
      avatarUrl: 'https://lh3.googleusercontent.com/a/ACg8ocKGEQN2mfhoKkBcfGhIYYO7vWekfl9LiocFjTyeOMZaEyeB9HTF=s96-c',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('users').doc('0JRc4NtwZTaeABl6Urx9jipwVyn2').set(userData);
    console.log('✅ Super Admin user document created successfully!');

    console.log('🎉 Super Admin created successfully!');
    console.log('📧 Email: tungchinhus@gmail.com');
    console.log('🆔 User ID: 0JRc4NtwZTaeABl6Urx9jipwVyn2');
    console.log('🔑 Role: super_admin');

  } catch (error) {
    console.error('❌ Error creating Super Admin:', error);
  } finally {
    process.exit(0);
  }
}

createSuperAdmin();
