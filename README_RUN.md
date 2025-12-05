# Hướng dẫn chạy Dự án Second-hand System

Để chạy toàn bộ hệ thống (Backend và Frontend) cùng một lúc, bạn cần mở **2 cửa sổ Terminal** riêng biệt.

## Bước 1: Chạy Backend (ASP.NET Core)
1. Mở Terminal thứ nhất.
2. Di chuyển đến thư mục gốc của dự án (nơi chứa file `Second-hand_System.sln`):
   ```bash
   cd c:\Users\MSI\CongNgheWeb\Final-Term\Second-hand_System
   ```
3. Chạy lệnh:
   ```bash
   dotnet run
   ```
4. **Kết quả**: Backend sẽ khởi động và lắng nghe tại `http://localhost:5000`. Cửa sổ này cần được giữ nguyên (không đóng).

## Bước 2: Chạy Frontend (Angular)
1. Mở Terminal thứ hai (bấm dấu `+` trong VS Code hoặc mở cửa sổ CMD/PowerShell mới).
2. Di chuyển đến thư mục Frontend:
   ```bash
   cd c:\Users\MSI\CongNgheWeb\Final-Term\Second-hand_System\ClientApp
   ```
3. Chạy lệnh:
   ```bash
   npm start
   ```
4. **Kết quả**: Frontend sẽ khởi động và lắng nghe tại `http://localhost:4200`.

## Bước 3: Sử dụng
*   Mở trình duyệt và truy cập: **[http://localhost:4200](http://localhost:4200)**
*   API Swagger (nếu cần test riêng): [http://localhost:5000/swagger](http://localhost:5000/swagger)

---

**Lưu ý:**
*   Đảm bảo cả 2 terminal đều đang chạy và không có lỗi.
*   Nếu port 5000 hoặc 4200 bị chiếm dụng, hãy tắt ứng dụng đang dùng port đó hoặc đổi port trong cấu hình.
