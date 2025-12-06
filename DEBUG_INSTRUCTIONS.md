## Request for User

Hãy làm theo các bước sau để tôi có thể xem log từ Backend:

1. **Restart Backend** (tại terminal đang chạy `dotnet run`):
   - Bấm `Ctrl + C`
   - Chạy lại: `dotnet run`

2. **Mở Browser** và vào `/admin/orders`

3. **Quan sát terminal Backend**, tìm dòng bắt đầu với `DEBUG GetAllOrders`

4. **Chụp màn hình terminal** và gửi tôi

Nếu không thấy dòng DEBUG nào → Backend không nhận được request (hoặc bị từ chối trước khi vào controller)
Nếu thấy `IsAuthenticated: False` → JWT token không hợp lệ

Sau khi có thông tin này, tôi sẽ biết chính xác vấn đề nằm ở đâu!
