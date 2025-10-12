# 🔍 Debug Login Issues - Hướng dẫn khắc phục

## ❌ Vấn đề không đăng nhập được

### **Các nguyên nhân phổ biến:**

1. **Google Sign-In Provider chưa enable**
2. **Domain chưa được authorize**
3. **Firestore rules quá strict**
4. **Browser block popup**
5. **Firebase configuration sai**

## 🔧 **Login Debug Tool**

### **Truy cập Debug Tool:**
- **URL**: `http://localhost:4200/login-debug`
- **Hoặc**: Trang login → Click "Login Debug"

### **Các test có sẵn:**
- ✅ **Firebase Connection Test** - Kiểm tra kết nối Firebase
- ✅ **Google Sign-In Test** - Test Google authentication
- ✅ **Firestore Test** - Kiểm tra quyền truy cập Firestore
- ✅ **Current Auth State** - Xem trạng thái hiện tại

## 🚀 **Các bước khắc phục**

### **Bước 1: Kiểm tra Firebase Console**

#### **Enable Google Sign-In:**
1. Vào [Firebase Console](https://console.firebase.google.com/project/vattuchinhhang-c5952)
2. **Authentication** → **Sign-in method**
3. **Enable Google** provider
4. **Save** settings

#### **Authorize Domains:**
1. **Authentication** → **Settings** → **Authorized domains**
2. Thêm `localhost` vào danh sách
3. Thêm `localhost:4200` nếu cần

### **Bước 2: Kiểm tra Browser Settings**

#### **Allow Popups:**
1. **Chrome**: Settings → Privacy → Site Settings → Popups
2. **Allow** popups cho `localhost:4200`
3. **Reload** trang và thử lại

#### **Clear Browser Data:**
1. **Clear cookies** và **localStorage**
2. **Hard refresh** (Ctrl+Shift+R)
3. **Thử đăng nhập** lại

### **Bước 3: Kiểm tra Firestore Rules**

#### **Current Rules:**
```javascript
// User có thể tạo chính mình với role phù hợp
allow create: if request.auth != null 
              && request.auth.uid == userId
              && (request.resource.data.role == "customer" 
                  || request.resource.data.role == "seller"
                  || (request.resource.data.role == "super_admin" 
                      && request.auth.token.email == "tungchinhus@gmail.com"));
```

#### **Deploy Rules:**
```bash
firebase deploy --only firestore:rules
```

### **Bước 4: Test với Debug Tool**

#### **Firebase Connection Test:**
- Click "Test Firebase Connection"
- Kiểm tra kết quả
- Nếu lỗi → Check Firebase config

#### **Google Sign-In Test:**
- Click "Test Google Sign-In"
- Cho phép popup nếu browser hỏi
- Kiểm tra kết quả trong console

#### **Firestore Test:**
- Click "Test Firestore Access"
- Kiểm tra permissions
- Nếu lỗi → Check Firestore rules

## 🎯 **Troubleshooting Guide**

### **Lỗi: "Google Sign-In không hoạt động"**

#### **Nguyên nhân:**
- Google provider chưa enable
- Domain chưa authorize
- Browser block popup

#### **Giải pháp:**
1. **Firebase Console** → Enable Google
2. **Add localhost** to authorized domains
3. **Allow popups** in browser
4. **Clear browser data**

### **Lỗi: "Missing or insufficient permissions"**

#### **Nguyên nhân:**
- Firestore rules quá strict
- User chưa có trong database
- Rules chưa được deploy

#### **Giải pháp:**
1. **Check firestore.rules**
2. **Deploy rules** với `firebase deploy`
3. **Test với debug tool**
4. **Check user creation logic**

### **Lỗi: "Domain not authorized"**

#### **Nguyên nhân:**
- localhost chưa được thêm vào authorized domains
- Firebase project config sai

#### **Giải pháp:**
1. **Firebase Console** → Authentication → Settings
2. **Add localhost** to authorized domains
3. **Save** và **test lại**

### **Lỗi: "Popup blocked"**

#### **Nguyên nhân:**
- Browser block popup cho Google Sign-In
- Popup blocker enabled

#### **Giải pháp:**
1. **Allow popups** cho localhost:4200
2. **Disable popup blocker** temporarily
3. **Use incognito mode** để test

## 🔧 **Quick Fixes**

### **Fix 1: Reset Everything**
```bash
# Clear all data
localStorage.clear();
sessionStorage.clear();

# Reload page
window.location.reload();
```

### **Fix 2: Check Console Errors**
1. **Open DevTools** (F12)
2. **Console tab**
3. **Look for errors** khi click Google Sign-In
4. **Check Network tab** for failed requests

### **Fix 3: Test in Incognito**
1. **Open incognito window**
2. **Go to localhost:4200**
3. **Try Google Sign-In**
4. **Check if works** without extensions

## 📱 **Testing Workflow**

### **Step 1: Basic Test**
1. **Open login page**
2. **Click "Login Debug"**
3. **Run all tests**
4. **Check results**

### **Step 2: Google Sign-In Test**
1. **Click "Test Google Sign-In"**
2. **Allow popup**
3. **Select Google account**
4. **Check success message**

### **Step 3: Full Login Test**
1. **Use "Quick Login" button**
2. **Click "Đăng nhập bằng Google"**
3. **Select tungchinhus@gmail.com**
4. **Verify Super Admin role**

## 🚨 **Emergency Solutions**

### **If Nothing Works:**

#### **Option 1: Temporary Rules**
```javascript
// Temporary permissive rules for testing
allow read, write: if request.auth != null;
```

#### **Option 2: Manual User Creation**
1. **Firebase Console** → Firestore
2. **Create users collection**
3. **Add user manually** với Super Admin role

#### **Option 3: Alternative Auth**
- **Use email/password** instead of Google
- **Create test account** in Firebase Console
- **Test with credentials**

## 📝 **Checklist**

### **Before Testing:**
- [ ] Firebase project active
- [ ] Google Sign-In enabled
- [ ] localhost in authorized domains
- [ ] Browser allows popups
- [ ] Firestore rules deployed

### **During Testing:**
- [ ] Check browser console
- [ ] Monitor network requests
- [ ] Test in incognito mode
- [ ] Use debug tools

### **After Testing:**
- [ ] Verify user created in Firestore
- [ ] Check role assignment
- [ ] Test role persistence
- [ ] Verify permissions

## 🎯 **Success Indicators**

### **Login Success:**
- ✅ **Google popup** appears
- ✅ **Account selection** works
- ✅ **Success message** shows
- ✅ **Redirect to dashboard**
- ✅ **Super Admin badge** visible

### **Role Assignment:**
- ✅ **tungchinhus@gmail.com** → Super Admin
- ✅ **Other emails** → Customer
- ✅ **Role persists** after reload
- ✅ **Permissions work** correctly

Sử dụng Login Debug Tool để identify và fix các vấn đề đăng nhập!
