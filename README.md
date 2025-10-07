# Vật Tư Chính Hãng - Admin System

Hệ thống quản lý cho cửa hàng vật tư chính hãng, được xây dựng với Angular và Angular Material.

## Tính năng

- **Dashboard**: Tổng quan hệ thống với các thống kê và hoạt động gần đây
- **Quản lý sản phẩm**: Quản lý danh mục sản phẩm và tồn kho
- **Quản lý đơn hàng**: Xử lý và theo dõi đơn hàng
- **Quản lý khách hàng**: Thông tin và lịch sử khách hàng
- **Quản lý nhà cung cấp**: Thông tin các nhà cung cấp
- **Báo cáo**: Các báo cáo thống kê và phân tích
- **Quản lý người dùng**: Phân quyền và quản lý tài khoản (chỉ admin)

## Công nghệ sử dụng

- **Angular 20**: Framework frontend
- **Angular Material**: UI components
- **TypeScript**: Ngôn ngữ lập trình
- **RxJS**: Reactive programming
- **CSS3**: Styling và responsive design

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js (phiên bản 18 trở lên)
- npm hoặc yarn
- Angular CLI

### Cài đặt dependencies
```bash
npm install
```

### Chạy ứng dụng
```bash
ng serve
```

Ứng dụng sẽ chạy tại `http://localhost:4200`

### Build cho production
```bash
ng build --configuration production
```

## Đăng nhập

Để đăng nhập vào hệ thống, sử dụng:
- **Username**: admin
- **Password**: admin

## Cấu trúc project

```
src/
├── app/
│   ├── components/          # Các component chính
│   │   ├── dashboard/       # Trang tổng quan
│   │   ├── dang-nhap/      # Trang đăng nhập
│   │   ├── san-pham/       # Quản lý sản phẩm
│   │   ├── don-hang/       # Quản lý đơn hàng
│   │   ├── khach-hang/     # Quản lý khách hàng
│   │   ├── nha-cung-cap/   # Quản lý nhà cung cấp
│   │   ├── bao-cao/        # Báo cáo
│   │   └── quan-ly-user/   # Quản lý người dùng
│   ├── services/           # Các service
│   │   ├── auth.service.ts # Xác thực
│   │   └── sidenav.service.ts # Điều khiển sidebar
│   ├── guards/             # Route guards
│   │   └── auth.guard.ts   # Bảo vệ route
│   ├── models/             # Các interface/model
│   └── assets/             # Tài nguyên tĩnh
├── styles.css              # CSS global
└── index.html              # File HTML chính
```

## Tính năng UI/UX

- **Responsive Design**: Tương thích với mọi thiết bị
- **Material Design**: Giao diện hiện đại theo chuẩn Material Design
- **Dark/Light Theme**: Hỗ trợ chế độ sáng/tối
- **Collapsible Sidebar**: Sidebar có thể thu gọn để tiết kiệm không gian
- **Smooth Animations**: Hiệu ứng chuyển động mượt mà
- **Loading States**: Trạng thái loading cho các thao tác

## Phát triển

### Thêm component mới
```bash
ng generate component components/ten-component
```

### Thêm service mới
```bash
ng generate service services/ten-service
```

### Chạy tests
```bash
ng test
```

## Lưu ý

- Project này được tạo dựa trên cấu trúc và UI của project tham khảo
- Hiện tại các tính năng chính đang ở trạng thái placeholder
- Cần phát triển thêm các tính năng cụ thể theo yêu cầu nghiệp vụ
- Authentication hiện tại là mock, cần tích hợp với hệ thống thực tế

## Liên hệ

Để được hỗ trợ hoặc báo cáo lỗi, vui lòng liên hệ với team phát triển.