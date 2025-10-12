# 🎯 HƯỚNG DẪN TẠO SUPER ADMIN TRỰC TIẾP

## ✅ **Cách nhanh nhất - Sử dụng Firebase Console:**

### 🔧 **Bước 1: Mở Firebase Console**
1. Truy cập: https://console.firebase.google.com/project/vattuchinhhang-c5952/firestore
2. Đăng nhập với tài khoản Google của bạn

### 🔧 **Bước 2: Tạo collection role_assignments**
1. Click **"Start collection"**
2. Collection ID: `role_assignments`
3. Click **"Next"**

### 🔧 **Bước 3: Tạo document**
1. Document ID: `0JRc4NtwZTaeABl6Urx9jipwVyn2`
2. Click **"Save"**

### 🔧 **Bước 4: Thêm các field**
Trong document vừa tạo, thêm các field sau:

| Field | Type | Value |
|-------|------|-------|
| `userId` | string | `0JRc4NtwZTaeABl6Urx9jipwVyn2` |
| `email` | string | `tungchinhus@gmail.com` |
| `role` | string | `super_admin` |
| `assignedBy` | string | `0JRc4NtwZTaeABl6Urx9jipwVyn2` |
| `assignedAt` | timestamp | `2024-12-15T10:00:00Z` |
| `reason` | string | `Manual bootstrap` |

### 🔧 **Bước 5: Tạo collection users (tùy chọn)**
1. Tạo collection mới: `users`
2. Document ID: `0JRc4NtwZTaeABl6Urx9jipwVyn2`
3. Thêm các field:

| Field | Type | Value |
|-------|------|-------|
| `id` | string | `0JRc4NtwZTaeABl6Urx9jipwVyn2` |
| `name` | string | `Chinh Do` |
| `email` | string | `tungchinhus@gmail.com` |
| `role` | string | `super_admin` |
| `avatarUrl` | string | `https://lh3.googleusercontent.com/a/ACg8ocKGEQN2mfhoKkBcfGhIYYO7vWekfl9LiocFjTyeOMZaEyeB9HTF=s96-c` |
| `createdAt` | timestamp | `2024-12-15T10:00:00Z` |

## 🎯 **Sau khi tạo xong:**

1. **Refresh trang** `/role-management` trong browser
2. **Kiểm tra**: Bạn sẽ thấy Super Admin đã được tạo
3. **Test**: Thử gán roles cho người khác

## 🔍 **Kiểm tra:**

- Vào `/role-management` để xem danh sách roles
- Vào `/dashboard` để xem role hiện tại
- Thử logout/login lại để refresh role

## 🎊 **Kết quả:**

**Sau khi tạo xong, bạn sẽ có Super Admin và có thể quản lý roles bình thường!**

**Làm theo hướng dẫn trên và bạn sẽ thành công!** 🚀
