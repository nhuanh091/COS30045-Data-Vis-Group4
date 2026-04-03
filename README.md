# Analytics Dashboard Project

Cấu trúc thư mục được thiết kế để dễ dàng mở rộng và bảo trì (Scalable React Project):

## 📂 Thư mục dự án

- **src/assets**: Chứa hình ảnh, icons, fonts...
- **src/components**: Chứa các component UI dùng chung (Button, Card, Input...).
- **src/hooks**: Chứa các custom hooks cho logic tái sử dụng.
- **src/pages**: Chứa các component chính đại diện cho từng trang (Home, Analytics, Settings...).
- **src/services**: Chứa cấu hình Axios và các hàm gọi API.
- **src/store**: Quản lý state toàn cục (Zustand).
- **src/styles**: Chứa file CSS toàn cục và cấu hình Material UI Theme (`theme.js`).
- **src/utils**: Các hàm tiện ích (Format date, format currency...).

## 🚀 Công nghệ sử dụng

- **ReactJS**: Functional Components + Hooks.
- **Vite**: Build tool nhanh và nhẹ.
- **MUI (Material UI)**: Thư viện component và theme.
- **Zustand**: Quản lý store đơn giản.
- **Axios**: Gọi API.
- **React Router**: Điều hướng trang.

## 🛠️ Hướng dẫn cài đặt

1. `npm install` - Cài đặt các thư viện cần thiết.
2. `npm run dev` - Chạy dự án ở chế độ development.
