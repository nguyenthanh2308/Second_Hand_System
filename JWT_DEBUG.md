Vấn đề tìm thấy: Backend **KHÔNG nhận được request** `/api/order/all` - bị reject tại Authentication Middleware

## Nguyên nhân có thể:
1. Token không được gửi trong header
2. Token format sai
3. Token expired 
4. JWT signing key không khớp

## Cách debug:

### Bước 1: Kiểm tra Frontend có gửi token không
Mở Console (F12), chạy:
```javascript
const user = JSON.parse(localStorage.getItem('currentUser'));
console.log('Has token:', !!user?.token);
console.log('Token preview:', user?.token?.substring(0, 50));
```

### Bước 2: Kiểm tra Network Request
1. Mở DevTools → Tab **Network**
2. Tải lại trang `/admin/orders`  
3. Tìm request `order/all`
4. Click vào → Tab **Headers** → Xem có `Authorization: Bearer ...` không

### Bước 3: Test với Swagger
1. Mở `http://localhost:5000/swagger`
2. Click **Authorize** button (ở góc phải)
3. Paste token vào (lấy từ localStorage)
4. Try calling `/api/order/all`
5. Nếu Swagger OK mà browser lỗi → Vấn đề ở CORS hoặc Frontend
6. Nếu Swagger cũng lỗi → Vấn đề ở JWT configuration Backend

Cho tôi biết kết quả từng bước!
