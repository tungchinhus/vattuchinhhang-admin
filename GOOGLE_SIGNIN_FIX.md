# 🔧 Fix Google Sign-In Issues - Hướng dẫn chi tiết

## 📊 **Kết quả Debug hiện tại:**

### ✅ **Firebase Connection - OK**
- UID: 90seddDI1LNQqX7wbHF9vHr29Bx2
- Role: customer

### ❌ **Google Sign-In - Failed**
### ❌ **Firestore - Fixed** ✅ (Rules đã deploy)

## 🚀 **Bước 1: Enable Google Sign-In Provider**

### **Truy cập Firebase Console:**
1. **URL**: https://console.firebase.google.com/project/vattuchinhhang-c5952
2. **Authentication** → **Sign-in method**
3. **Google** → **Enable**
4. **Project support email**: Chọn email của bạn
5. **Save**

### **Cấu hình Google Provider:**
```
✅ Enable Google Sign-In
✅ Project support email: tungchinhus@gmail.com
✅ Web SDK configuration: Auto
```

## 🌐 **Bước 2: Authorize Domains**

### **Thêm Authorized Domains:**
1. **Authentication** → **Settings** → **Authorized domains**
2. **Add domain**: `localhost`
3. **Add domain**: `localhost:4200` (nếu cần)
4. **Save**

### **Danh sách domains cần có:**
```
✅ localhost
✅ localhost:4200
✅ vattuchinhhang-c5952.firebaseapp.com
```

## 🔧 **Bước 3: Test Google Sign-In**

### **Test trong Browser:**
1. **Open DevTools** (F12)
2. **Console tab**
3. **Click "Test Google Sign-In"**
4. **Check for errors**

### **Common Errors & Solutions:**

#### **Error: "auth/popup-blocked"**
- **Nguyên nhân**: Browser block popup
- **Giải pháp**: Allow popups cho localhost:4200

#### **Error: "auth/unauthorized-domain"**
- **Nguyên nhân**: Domain chưa authorize
- **Giải pháp**: Add localhost to authorized domains

#### **Error: "auth/operation-not-allowed"**
- **Nguyên nhân**: Google provider chưa enable
- **Giải pháp**: Enable Google in Firebase Console

## 🎯 **Bước 4: Test với tungchinhus@gmail.com**

### **Super Admin Login Test:**
1. **Click "Đăng nhập bằng Google"**
2. **Select tungchinhus@gmail.com**
3. **Allow permissions**
4. **Check success message**
5. **Verify Super Admin role**

### **Expected Results:**
```
✅ Google popup appears
✅ Account selection works
✅ Success message: "Chào mừng Siêu quản trị viên!"
✅ Redirect to dashboard
✅ Super Admin badge visible
```

## 🔍 **Bước 5: Debug với Console**

### **Check Browser Console:**
```javascript
// Open DevTools (F12) → Console
// Look for these messages:

✅ "AuthService: Auth state changed, user: [User object]"
✅ "AuthService: User authenticated: [AuthUser object]"
✅ "Creating super admin user: tungchinhus@gmail.com"

❌ "Google Sign-In error: [error details]"
❌ "Error handling user authentication: [error details]"
```

### **Check Network Tab:**
- **Look for failed requests** to Firebase
- **Check response codes** (should be 200)
- **Verify CORS headers**

## 🚨 **Emergency Fixes**

### **Fix 1: Clear All Data**
```javascript
// In browser console:
localStorage.clear();
sessionStorage.clear();
window.location.reload();
```

### **Fix 2: Test in Incognito**
1. **Open incognito window**
2. **Go to localhost:4200**
3. **Try Google Sign-In**
4. **Check if works** without extensions

### **Fix 3: Alternative Test**
```javascript
// Test Firebase Auth directly in console:
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const auth = getAuth();
const provider = new GoogleAuthProvider();

signInWithPopup(auth, provider)
  .then((result) => {
    console.log('Success:', result.user);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

## 📱 **Testing Checklist**

### **Before Testing:**
- [ ] Google Sign-In enabled in Firebase Console
- [ ] localhost in authorized domains
- [ ] Browser allows popups
- [ ] Firestore rules deployed
- [ ] Clear browser data

### **During Testing:**
- [ ] Check browser console for errors
- [ ] Monitor network requests
- [ ] Test in incognito mode
- [ ] Use debug tools

### **After Testing:**
- [ ] Verify user created in Firestore
- [ ] Check Super Admin role assignment
- [ ] Test role persistence after reload
- [ ] Verify permissions work

## 🎯 **Success Indicators**

### **Google Sign-In Success:**
- ✅ **Popup appears** without errors
- ✅ **Account selection** works smoothly
- ✅ **Success message** shows
- ✅ **Redirect to dashboard**
- ✅ **No console errors**

### **Super Admin Assignment:**
- ✅ **tungchinhus@gmail.com** → Super Admin role
- ✅ **Role persists** after page reload
- ✅ **Super Admin badge** visible
- ✅ **User management access** works

## 🔧 **Quick Commands**

### **Deploy Firestore Rules:**
```bash
firebase deploy --only firestore:rules
```

### **Check Firebase Status:**
```bash
firebase projects:list
firebase use vattuchinhhang-c5952
```

### **Open Firebase Console:**
```bash
firebase open
```

## 📞 **Next Steps**

1. **Enable Google Sign-In** in Firebase Console
2. **Add localhost** to authorized domains
3. **Test Google Sign-In** với debug tool
4. **Verify Super Admin** role assignment
5. **Test full login flow**

Sau khi hoàn thành các bước trên, Google Sign-In sẽ hoạt động bình thường!
