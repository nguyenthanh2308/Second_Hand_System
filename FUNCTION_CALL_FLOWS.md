# Giải Thích Chi Tiết Các Hàm & Phương Thức

Tài liệu này giải thích ý nghĩa và tác dụng của tất cả các hàm/phương thức được sử dụng trong luồng nghiệp vụ. Mỗi mục có link trỏ đến file code thực tế.

---

## 📱 FRONTEND - ANGULAR

### 1. Component Methods (Phương Thức Của Component)

#### `ngOnInit()`
📂 **Ví dụ trong**: [catalog.component.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/storefront/catalog/catalog.component.ts)

```typescript
ngOnInit() {
  this.loadProducts();
}
```
- **Là gì**: Lifecycle hook của Angular, tự động chạy khi component được khởi tạo.
- **Tác dụng**: Khởi tạo dữ liệu ban đầu cho component (giống constructor nhưng dùng cho async operations).
- **Khi nào chạy**: Chạy 1 lần duy nhất sau khi Angular tạo component và set các @Input properties.

---

#### `subscribe()`
📂 **Ví dụ trong**: [checkout.component.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/storefront/checkout/checkout.component.ts#L57-L93)

```typescript
this.authService.login(loginRequest).subscribe({
  next: (token) => { /* Xử lý thành công */ },
  error: (err) => { /* Xử lý lỗi */ }
});
```
- **Là gì**: Phương thức của RxJS Observable để "lắng nghe" kết quả từ async operations.
- **Tác dụng**: Đăng ký nhận kết quả khi HTTP request hoàn thành (giống `.then()` của Promise).
- **Tham số**:
  - `next`: Callback chạy khi thành công.
  - `error`: Callback chạy khi có lỗi.
  - `complete`: (Optional) Callback khi hoàn tất.

---

#### `@Input()` - Component Input Property
📂 **Ví dụ trong**: [loading-spinner.component.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/shared/spinner/loading-spinner.component.ts#L41)

```typescript
// Child Component
@Component({
  selector: 'app-loading-spinner',
  template: '<div *ngIf="isLoading">Loading...</div>'
})
export class LoadingSpinnerComponent {
  @Input() isLoading: boolean = false;  // Nhận data từ parent
}
```

```html
<!-- Parent Component Template -->
<app-loading-spinner [isLoading]="showSpinner"></app-loading-spinner>
```

- **Là gì**: Decorator đánh dấu property nhận dữ liệu TỪ component cha (parent → child communication).
- **Tác dụng**: Cho phép parent component truyền data xuống child component.
- **Cú pháp binding**: `[propertyName]="value"` trong template của parent.
- **Luồng dữ liệu**: Parent → Child (one-way data binding).

**Ví dụ thực tế**:
```typescript
// product-card.component.ts (Child)
export class ProductCardComponent {
  @Input() product!: Product;        // Nhận product object
  @Input() showPrice: boolean = true; // Nhận flag với default value
}
```

```html
<!-- catalog.component.html (Parent) -->
<app-product-card 
  [product]="selectedProduct" 
  [showPrice]="true">
</app-product-card>
```

---

#### `@Output()` - Component Output Event
📂 **Concept**: Dùng để emit events từ child lên parent

```typescript
// Child Component
@Component({
  selector: 'app-product-card',
  template: '<button (click)="addToCart()">Add to Cart</button>'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() productAdded = new EventEmitter<Product>();  // Emit event lên parent
  
  addToCart() {
    this.productAdded.emit(this.product);  // Trigger event
  }
}
```

```html
<!-- Parent Component Template -->
<app-product-card 
  [product]="selectedProduct"
  (productAdded)="onProductAdded($event)">  <!-- Lắng nghe event -->
</app-product-card>
```

```typescript
// Parent Component
export class CatalogComponent {
  onProductAdded(product: Product) {
    this.cartService.addToCart(product);  // Xử lý event từ child
  }
}
```

- **Là gì**: Decorator đánh dấu property emit events LÊN component cha (child → parent communication).
- **Tác dụng**: Cho phép child component thông báo sự kiện hoặc gửi data lên parent.
- **Kiểu dữ liệu**: `EventEmitter<T>` (Generic type T là kiểu data được emit).
- **Cú pháp binding**: `(eventName)="handler($event)"` trong template của parent.
- **Luồng dữ liệu**: Child → Parent (event-driven).

**So sánh @Input vs @Output**:

| | @Input() | @Output() |
|---|---|---|
| **Hướng dữ liệu** | Parent → Child | Child → Parent |
| **Kiểu dữ liệu** | Any type | EventEmitter\<T\> |
| **Template syntax** | `[property]="value"` | `(event)="handler($event)"` |
| **Tác dụng** | Truyền data xuống | Emit events lên |
| **Ví dụ** | Truyền Product object | Notify khi user click button |

**Khi nào dùng**:
- **@Input()**: Khi child component cần hiển thị data từ parent (ví dụ: ProductCard nhận Product object).
- **@Output()**: Khi child component cần thông báo action lên parent (ví dụ: User click "Add to Cart").

**Best Practice**:
```typescript
// ✅ GOOD: Type-safe với Generic
@Output() productAdded = new EventEmitter<Product>();

// ❌ BAD: Không type-safe
@Output() productAdded = new EventEmitter();
```

---

### 2. Service Methods (Angular Services)

#### `BehaviorSubject`
📂 **Sử dụng trong**: [auth.service.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/auth.service.ts#L11-L17)

```typescript
private currentUserSubject: BehaviorSubject<User | null>;
```
- **Là gì**: Một loại Observable đặc biệt của RxJS, lưu trữ giá trị hiện tại và emit cho subscribers mới.
- **Tác dụng**: Quản lý state toàn cục (như Redux mini), cho phép nhiều component lắng nghe thay đổi.
- **Khác với Observable thường**: Luôn có giá trị khởi tạo, emit ngay giá trị hiện tại cho subscriber mới.

**Ví dụ trong code**:
```typescript
// Khởi tạo - Line 14-16
this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
this.currentUser$ = this.currentUserSubject.asObservable();

// Update giá trị - Line 30
this.currentUserSubject.next(user);

// Lấy giá trị hiện tại - Line 20-22
public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
}
```

---

#### `pipe()` và `map()`
📂 **Sử dụng trong**: [auth.service.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/auth.service.ts#L24-L32)

```typescript
return this.http.post<{ token: string }>('/api/auth/login', loginRequest)
  .pipe(map(response => {
    const token = response.token;
    const user = this.decodeToken(token);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    return token;
  }));
```
- **`pipe()`**: Cho phép "xử lý" dữ liệu trước khi trả về cho subscriber.
- **`map()`**: Transform dữ liệu (giống `Array.map()`), chuyển đổi response thành format khác.
- **Tác dụng**: Xử lý response (decode JWT, lưu sessionStorage, emit state) trước khi component nhận.

---

#### `HttpClient.post()` / `get()` / `put()` / `delete()`
📂 **Sử dụng trong**: 
- [order.service.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/order.service.ts#L12-L13)
- [product.service.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/product.service.ts#L12-L20)

```typescript
this.http.post<{ token: string }>('/api/auth/login', loginRequest)
```
- **Là gì**: Angular HTTP Client method để gọi REST API.
- **Tham số**:
  - **Generic Type** `<{ token: string }>`: Định nghĩa kiểu dữ liệu mong đợi từ response.
  - **URL**: Endpoint của API.
  - **Body**: (POST/PUT) Dữ liệu gửi lên server.
  - **Options**: (Optional) Headers, params, responseType...
- **Return**: Observable - phải subscribe để trigger request.

---

#### `HttpParams`
📂 **Sử dụng trong**: [product.service.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/product.service.ts#L12-L20)

```typescript
let params = new HttpParams();
if (filter.keyword) params = params.set('keyword', filter.keyword);
if (filter.minPrice) params = params.set('minPrice', filter.minPrice);
if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice);
if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
return this.http.get<Product[]>('/api/product', { params });
```
- **Là gì**: Builder để tạo URL query parameters.
- **Tác dụng**: Tự động encode và format query string.
- **Kết quả**: `/api/product?keyword=giày&categoryId=3`
- **Lưu ý**: Immutable - mỗi `.set()` trả về instance mới.

---

#### `decodeToken()`
📂 **Định nghĩa trong**: [auth.service.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/auth.service.ts#L49-L64)

```typescript
private decodeToken(token: string): User {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload['nameid'] || '0'),
      username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload['unique_name'] || '',
      email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload['email'] || '',
      role: payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Customer',
      token: token
    };
  } catch (e) {
    console.error('Error decoding token', e);
    return { id: 0, username: '', email: '', role: 'Customer', token: token };
  }
}
```
- **Là gì**: Hàm custom để giải mã JWT token.
- **Cách hoạt động**:
  1. `token.split('.')[1]`: Lấy phần payload (JWT có 3 phần: header.payload.signature).
  2. `atob()`: Base64 decode (browser built-in function).
  3. `JSON.parse()`: Chuyển string thành object.
- **Tác dụng**: Lấy thông tin user (id, username, role) từ token mà không cần gọi API.

---

#### `sessionStorage.setItem()` / `getItem()`
📂 **Sử dụng trong**: [auth.service.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/auth.service.ts#L14-L16)

```typescript
sessionStorage.setItem('currentUser', JSON.stringify(user));
const storedUser = sessionStorage.getItem('currentUser');
```
- **Là gì**: Browser API để lưu trữ dữ liệu tạm thời (chỉ tồn tại trong tab/session hiện tại).
- **Tác dụng**: Lưu user info sau khi login, tự động mất khi đóng tab.
- **So với localStorage**: `sessionStorage` xóa khi đóng tab, `localStorage` lưu vĩnh viễn.

---

### 3. HTTP Interceptor

#### `HttpInterceptorFn`
📂 **Định nghĩa trong**: [jwt.interceptor.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/interceptors/jwt.interceptor.ts)

```typescript
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
  if (currentUser?.token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${currentUser.token}` }
    });
  }
  return next(req);
};
```
- **Là gì**: Function interceptor của Angular (kiểu mới, thay thế class-based).
- **Tác dụng**: "Can thiệp" vào mọi HTTP request trước khi gửi đi.
- **Cách hoạt động**:
  1. Lấy token từ `sessionStorage`.
  2. Clone request và thêm header `Authorization`.
  3. Gọi `next(req)` để tiếp tục request chain.
- **Kết quả**: Tất cả request tự động có header `Authorization: Bearer <token>`.
- **Đăng ký tại**: [app.config.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/app.config.ts#L11)

---

## 🔧 BACKEND - ASP.NET CORE

### 1. Controller Attributes & Methods

#### `[Route("api/[controller]")]`
📂 **Ví dụ trong**: [AuthController.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/AuthController.cs#L7-L9)

```csharp
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
```
- **Là gì**: Attribute định nghĩa base route cho controller.
- **`[controller]`**: Placeholder tự động thay bằng tên controller (bỏ "Controller" suffix).
- **Kết quả**: `AuthController` → route base là `/api/auth`.

---

#### `[HttpPost("login")]`
📂 **Ví dụ trong**: [AuthController.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/AuthController.cs#L18-L29)

```csharp
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
```
- **Là gì**: Attribute định nghĩa HTTP verb và sub-route.
- **Kết quả**: POST request đến `/api/auth/login` sẽ call method này.
- **`[FromBody]`**: Bind JSON body của request vào parameter `loginDto`.

---

#### `[Authorize]` và `[Authorize(Roles = "Admin")]`
📂 **Ví dụ trong**: 
- [OrderController.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/OrderController.cs#L11) - `[Authorize]`
- [OrderController.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/OrderController.cs#L57-L58) - `[Authorize(Roles = "Admin")]`
- [ProductController.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/ProductController.cs#L44) - `[Authorize(Roles = "Admin")]`

```csharp
[Authorize] // Yêu cầu đăng nhập
public async Task<IActionResult> Checkout(...)

[Authorize(Roles = "Admin")] // Chỉ Admin mới được
public async Task<IActionResult> DeleteProduct(...)
```
- **Là gì**: Middleware attribute kiểm tra authentication/authorization.
- **`[Authorize]`**: Yêu cầu JWT token hợp lệ.
- **`[Authorize(Roles = "Admin")]`**: Yêu cầu token phải có claim `Role = Admin`.
- **Nếu fail**: Tự động trả về 401 Unauthorized hoặc 403 Forbidden.

---

#### `User.FindFirst(ClaimTypes.NameIdentifier)`
📂 **Ví dụ trong**: [OrderController.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/OrderController.cs#L27-L30)

```csharp
var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
if (userIdClaim == null) return Unauthorized();
int userId = int.Parse(userIdClaim.Value);
```
- **Là gì**: Lấy thông tin user từ JWT token đã được decode.
- **`User`**: Property của ControllerBase, chứa ClaimsPrincipal từ JWT.
- **`ClaimTypes.NameIdentifier`**: Constant của .NET = `"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"` (chứa User ID).
- **Tác dụng**: Lấy ID của user đang đăng nhập từ token.

---

#### `Ok()`, `BadRequest()`, `NotFound()`, `NoContent()`
📂 **Ví dụ trong**: [AuthController.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/AuthController.cs#L23-L28)

```csharp
return Ok(new { Token = token });        // 200 OK
return BadRequest(ex.Message);           // 400 Bad Request
return NotFound();                       // 404 Not Found
return NoContent();                      // 204 No Content
```
- **Là gì**: Helper methods của ControllerBase để trả về HTTP response.
- **Tác dụng**: Tự động set status code và serialize object thành JSON.

---

### 2. Service Layer Methods

#### `async` và `await`
📂 **Ví dụ trong**: [AuthService.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/AuthService.cs#L21-L29)

```csharp
public async Task<string> LoginAsync(LoginDto loginDto)
{
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);
    if (user == null || user.PasswordHash != HashPassword(loginDto.Password))
        throw new UnauthorizedAccessException("Invalid username or password.");
    return _tokenService.GenerateToken(user);
}
```
- **Là gì**: C# asynchronous programming keywords.
- **`async`**: Đánh dấu method là asynchronous (có thể chạy không đồng bộ).
- **`await`**: Đợi async operation hoàn thành, nhưng không block thread.
- **`Task<T>`**: Return type của async method (giống Promise trong JS).
- **Tác dụng**: Cho phép server xử lý nhiều requests cùng lúc mà không bị block.

---

#### `FirstOrDefaultAsync()`
📂 **Ví dụ trong**: [AuthService.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/AuthService.cs#L23)

```csharp
var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);
```
- **Là gì**: LINQ extension method của EF Core.
- **Tác dụng**: Lấy phần tử đầu tiên thỏa điều kiện, hoặc `null` nếu không tìm thấy.
- **SQL tương đương**: `SELECT * FROM Users WHERE Username = 'customer1' LIMIT 1;`

---

#### `AnyAsync()`
📂 **Ví dụ trong**: 
- [AuthService.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/AuthService.cs#L34)
- [OrderService.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/OrderService.cs#L57-L61)

```csharp
if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
    throw new BadHttpRequestException("Username already exists.");
```
- **Là gì**: LINQ method kiểm tra tồn tại.
- **Return**: `true` nếu có ít nhất 1 bản ghi thỏa điều kiện, `false` nếu không.
- **SQL tương đương**: `SELECT COUNT(*) > 0 FROM Users WHERE Username = 'customer1';`

---

#### `HashPassword()`
📂 **Định nghĩa trong**: [AuthService.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/AuthService.cs#L52-L57)

```csharp
private string HashPassword(string password)
{
    using var sha256 = SHA256.Create();
    var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
    return Convert.ToBase64String(bytes);
}
```
- **Là gì**: Hàm custom hash mật khẩu bằng SHA256.
- **Tác dụng**: Chuyển password plain text thành chuỗi hash (one-way encryption).
- **Lưu ý**: SHA256 không phải là cách tốt nhất (nên dùng BCrypt/PBKDF2), nhưng đơn giản cho demo.

---

#### `GenerateToken()`
📂 **Định nghĩa trong**: [TokenService.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/TokenService.cs)

```csharp
public string GenerateToken(User user)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Role, user.Role.ToString())
    };
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var token = new JwtSecurityToken(
        issuer: _issuer,
        audience: _audience,
        claims: claims,
        expires: DateTime.Now.AddHours(24),
        signingCredentials: creds
    );
    return new JwtSecurityTokenHandler().WriteToken(token);
}
```
- **Là gì**: Hàm tạo JWT token.
- **Claims**: Thông tin user được nhúng vào token (ID, Username, Role).
- **SymmetricSecurityKey**: Secret key để sign token (chỉ server biết).
- **SigningCredentials**: Thuật toán mã hóa (HMAC-SHA256).
- **JwtSecurityToken**: Object đại diện token với thời gian hết hạn.
- **Tác dụng**: Tạo token an toàn, không thể giả mạo (vì có signature).

---

### 3. Repository Methods

#### `AsQueryable()`
📂 **Ví dụ trong**: [ProductRepository.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Repositories/ProductRepository.cs)

```csharp
var query = _dbSet.AsQueryable();
query = query.Where(p => p.Name.Contains(keyword));
```
- **Là gì**: Chuyển IEnumerable thành IQueryable để build query động.
- **Tác dụng**: Cho phép chain nhiều `.Where()` trước khi execute query.
- **Lợi ích**: EF Core chỉ tạo 1 SQL duy nhất từ toàn bộ chain, không query nhiều lần.

---

#### `Include()` và `ThenInclude()`
📂 **Ví dụ trong**: [OrderRepository.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Repositories/OrderRepository.cs#L15-L21)

```csharp
return await _dbSet
    .AsNoTracking()
    .Include(o => o.User)
    .Include(o => o.OrderDetails)
    .ThenInclude(od => od.Product)
    .OrderByDescending(o => o.OrderDate)
    .ToListAsync();
```
- **Là gì**: EF Core method để "eager load" related entities (JOIN).
- **`Include(p => p.Category)`**: Load cả Category của Product.
- **`ThenInclude()`**: Load related entity của related entity (nested).
- **SQL tương đương**: 
  ```sql
  SELECT o.*, u.*, od.*, p.*
  FROM Orders o
  LEFT JOIN Users u ON o.UserId = u.Id
  LEFT JOIN OrderDetails od ON o.Id = od.OrderId
  LEFT JOIN Products p ON od.ProductId = p.Id
  ORDER BY o.OrderDate DESC
  ```

---

#### `ToListAsync()`
📂 **Ví dụ trong**: [OrderRepository.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Repositories/OrderRepository.cs#L21)

```csharp
return await query.ToListAsync();
```
- **Là gì**: Execute query và chuyển kết quả thành List.
- **Tác dụng**: Đây là lúc SQL thực sự được gửi đến database.
- **Trước `ToListAsync()`**: Chỉ là IQueryable (chưa chạy query).
- **Sau `ToListAsync()`**: Có kết quả thực tế từ DB.

---

### 4. Transaction Methods (Quan Trọng Nhất)

#### `BeginTransactionAsync()`
📂 **Sử dụng trong**: [OrderService.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/OrderService.cs#L27)

```csharp
using var transaction = await _context.Database.BeginTransactionAsync();
```
- **Là gì**: Mở transaction trong database.
- **Tác dụng**: Đảm bảo nhiều thao tác DB xảy ra nguyên tử (all-or-nothing).
- **`using`**: Tự động dispose transaction khi ra khỏi scope.

---

#### `CommitAsync()`
📂 **Sử dụng trong**: [OrderService.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/OrderService.cs#L90)

```csharp
await transaction.CommitAsync();
```
- **Là gì**: Xác nhận tất cả thay đổi trong transaction.
- **Tác dụng**: Lưu tất cả INSERT/UPDATE/DELETE xuống DB vĩnh viễn.
- **SQL**: `COMMIT;`

---

#### `RollbackAsync()`
📂 **Sử dụng trong**: [OrderService.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/OrderService.cs#L96)

```csharp
await transaction.RollbackAsync();
throw; // Ném lỗi lên Controller
```
- **Là gì**: Hủy bỏ tất cả thay đổi trong transaction.
- **Tác dụng**: Quay về trạng thái trước khi mở transaction (như chưa có gì xảy ra).
- **Khi nào dùng**: Khi có lỗi hoặc điều kiện nghiệp vụ không thỏa mãn.
- **SQL**: `ROLLBACK;`

---

#### `SaveChangesAsync()`
📂 **Sử dụng trong**: [OrderService.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/OrderService.cs#L89)

```csharp
await _context.SaveChangesAsync();
```
- **Là gì**: Lưu tất cả pending changes trong DbContext xuống DB.
- **Khi dùng trong Transaction**: Chưa commit ngay, đợi `CommitAsync()`.
- **Khi dùng không có Transaction**: Tự động commit luôn.

---

## 🔒 Xử Lý Race Condition

### Atomic Check Pattern
📂 **Triển khai trong**: [OrderService.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/OrderService.cs#L41-L66)

```csharp
// BƯỚC 1: Kiểm tra Status (Line 51-54)
if (product.Status != ProductStatus.Available)
    throw new ProductSoldException($"Product '{product.Name}' is already sold!");

// BƯỚC 2: Kiểm tra Pending Orders (Line 57-66)
var existingOrders = await _context.Orders
    .Include(o => o.OrderDetails)
    .Where(o => (o.Status == OrderStatus.Pending || o.Status == OrderStatus.Shipping) 
             && o.OrderDetails.Any(od => od.ProductId == productId))
    .AnyAsync();

if (existingOrders)
    throw new ProductSoldException($"Product '{product.Name}' is currently in another pending order.");
```

**Tại sao cần 2 lần check?**
1. **Check 1 (Status)**: Kiểm tra sản phẩm đã SOLD vĩnh viễn chưa.
2. **Check 2 (Pending Orders)**: Kiểm tra sản phẩm có đang trong đơn chưa hoàn tất không (Pending/Shipping).

**Cách hoạt động khi 2 người mua cùng lúc:**
```
User A                           User B
│                                │
├─ BEGIN TRANSACTION             │
├─ Check Product Status: OK      │
├─ Check Pending Orders: OK      │
│                                ├─ BEGIN TRANSACTION
│                                ├─ Check Product Status: OK
├─ INSERT Order (Line 86)        │
├─ INSERT OrderDetails (Line 79)  │
│                                ├─ Check Pending Orders: FOUND! (A's order)
│                                └─ ROLLBACK ❌
├─ COMMIT ✅ (Line 90)           
│
```

**Kết quả**: User A thành công, User B nhận lỗi "Sản phẩm đang trong đơn hàng khác".

---

## 📊 Tổng Kết

| Layer | Key Methods | Tác Dụng Chính | File Tham Khảo |
|-------|------------|---------------|---------------|
| **Angular Component** | `ngOnInit()`, `subscribe()` | Khởi tạo & lắng nghe kết quả | [checkout.component.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/storefront/checkout/checkout.component.ts) |
| **Angular Service** | `http.post()`, `pipe(map())` | Gọi API & transform data | [auth.service.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/auth.service.ts) |
| **HTTP Interceptor** | `clone()`, `setHeaders()` | Tự động gắn JWT token | [jwt.interceptor.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/interceptors/jwt.interceptor.ts) |
| **ASP.NET Controller** | `[Authorize]`, `User.FindFirst()` | Validate & extract user info | [OrderController.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/OrderController.cs) |
| **Service Layer** | `BeginTransactionAsync()`, `CommitAsync()` | Xử lý nghiệp vụ & transaction | [OrderService.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/OrderService.cs) |
| **Repository** | `Include()`, `ToListAsync()` | Truy vấn database với EF Core | [OrderRepository.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Repositories/OrderRepository.cs) |

---

## 💡 Best Practices Quan Trọng

1. **Always use Transactions** cho multi-step operations → [Xem OrderService](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/OrderService.cs#L27-L98)
2. **Hash passwords** - never store plain text → [Xem AuthService](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/AuthService.cs#L52-L57)
3. **Validate JWT** trên mọi protected endpoint → [Xem Program.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Program.cs#L42-L80)
4. **Check Race Conditions** bằng atomic operations trong Transaction → [Xem OrderService](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/OrderService.cs#L41-L66)
5. **Use Async/Await** để tránh block server threads → Xem mọi Service methods

---

## 🔄 LUỒNG GỌI HÀM (FUNCTION CALL FLOW)

Phần này mô tả chi tiết cách các hàm gọi nhau từ Frontend xuống Backend và response trả về.

---

### 📍 Flow 1: LOGIN (Đăng Nhập)

#### **Frontend → Backend (Request Flow)**

##### **Bước 1: User Click Login Button**
👤 **User Action**: Nhập `username` và `password` vào form, sau đó click button **"Login"**

📂 **File**: `ClientApp/src/app/features/auth/login/login.component.ts`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/auth/login/login.component.ts#L28-L39)

---

**Template (HTML):**
```html
<!-- File: login.component.html -->
<form (ngSubmit)="onSubmit()">
  <input [(ngModel)]="username" placeholder="Username">
  <input [(ngModel)]="password" type="password" placeholder="Password">
  <button type="submit">Login</button>  <!-- 👈 User click vào đây -->
</form>
```

**Giải thích - Template:**
- 👤 **User thao tác**: 
  1. Nhập username vào input field (bind với `this.username` qua `[(ngModel)]`)
  2. Nhập password vào input field (bind với `this.password` qua `[(ngModel)]`)
  3. Click button "Login" → Trigger `(ngSubmit)` event
- 🔧 **Angular binding**:
  - `(ngSubmit)="onSubmit()"` - Event binding: khi submit form sẽ gọi method `onSubmit()`
  - `[(ngModel)]` - Two-way data binding: sync giữa input và component properties

---

**Component (TypeScript):**
```typescript
// File: login.component.ts
onSubmit() {  // 👈 Method này được gọi khi user click "Login"
    this.authService.login({ 
        username: this.username,   // Lấy từ form input
        password: this.password    // Lấy từ form input
    }).subscribe({
        next: () => {
            this.router.navigate([this.returnUrl]);  // ✅ Thành công → Navigate
        },
        error: (err) => {
            this.error = 'Invalid username or password';  // ❌ Lỗi → Hiển thị error
            console.error(err);
        }
    });
}
```

**Giải thích - Component:**
- 🔧 **Method `onSubmit()`**:
  - Thu thập `username` và `password` đã được bind từ template
  - Gọi `AuthService.login()` để xử lý authentication
    - 📍 **Định nghĩa tại**: [auth.service.ts#L24](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/auth.service.ts#L24)
  - Subscribe để nhận kết quả:
    - **Success case**: Navigate đến trang `returnUrl` (thường là Home)
    - **Error case**: Hiển thị error message cho user
- 📍 **File tham khảo**:
  - HTML Template: [login.component.html](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/auth/login/login.component.html)
  - Component Logic: [login.component.ts#L28-L39](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/auth/login/login.component.ts#L28-L39)

---

##### **Bước 2: AuthService.login() - Xử lý Login Logic**
📂 **File**: `ClientApp/src/app/core/services/auth.service.ts`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/auth.service.ts#L24-L32)

```typescript
// File: auth.service.ts
login(loginRequest: LoginRequest): Observable<string> {
    return this.http.post<{ token: string }>('/api/auth/login', loginRequest)
        .pipe(map(response => {
            const token = response.token;
            const user = this.decodeToken(token);  // Decode JWT
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);    // Emit state change
            return token;
        }));
}
```

**Giải thích**: 
- 🌐 **API Endpoint**: `POST /api/auth/login`
  - 📍 **Định nghĩa tại**: [AuthController.cs#L18](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/AuthController.cs#L18) - Backend route handler
  - 📍 **Được gọi từ**: [auth.service.ts#L25](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/auth.service.ts#L25) - Frontend service

- **`this.http.post()`**: Gửi POST request, trả về `Observable` (async stream cần `.subscribe()` để thực thi)

- **`.pipe(map())`**: RxJS operator chain để transform response trước khi trả về subscriber

- **`decodeToken(token)`**: Parse JWT payload để extract user info (id, username, role) mà không cần gọi API
  - 📍 [auth.service.ts#L49-L64](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/auth.service.ts#L49-L64)

- **`sessionStorage.setItem()`**: Browser API lưu user data trong session (mất khi đóng browser)

- **`currentUserSubject.next(user)`**: 
  - **`BehaviorSubject`**: Observable đặc biệt có thể emit value và lưu current state ([auth.service.ts#L11](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/auth.service.ts#L11))
  - **`.next()`**: Broadcast user info đến TẤT CẢ components đang subscribe (Header, Guards, etc.)

---

##### **Bước 3: Decode JWT Token**
📂 **File**: `ClientApp/src/app/core/services/auth.service.ts`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/auth.service.ts#L49-L64)

```typescript
// File: auth.service.ts
private decodeToken(token: string): User {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '0'),
            username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
            email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
            role: payload['role'] || 'Customer',
            token: token
        };
    } catch (e) {
        console.error('Error decoding token', e);
        return { id: 0, username: '', email: '', role: 'Customer', token: token };
    }
}
```

**Giải thích**: 
- **JWT Token Structure**: `header.payload.signature` - lấy phần `payload` (part [1])
- **`atob()`**: Browser API để Base64 decode payload thành JSON string
- **`JSON.parse()`**: Parse string thành object, extract claims (id, username, email, role)
- **Claims mapping**: Map từ JWT standard claims (dài) sang User properties (ngắn gọn)
- **Try-catch**: Nếu decode lỗi → return default User object (defensive programming)

---

##### **Bước 4: JWT Interceptor Auto-Attach Token**
📂 **File**: `ClientApp/src/app/core/interceptors/jwt.interceptor.ts`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/interceptors/jwt.interceptor.ts)

```typescript
// File: jwt.interceptor.ts
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
    
    if (currentUser?.token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${currentUser.token}`
            }
        });
    }
    
    return next(req);
};
```

**Giải thích**: 
- **HttpInterceptorFn**: Angular function intercept MỌI HTTP requests trước khi gửi đi
- **Process**: Đọc token từ `sessionStorage` → Clone request + add header `Authorization: Bearer <token>`
- **`req.clone()`**: HTTP request immutable, phải clone để modify headers
- **`next(req)`**: Pass request đến handler tiếp theo trong chain
- **Registration**: Đăng ký tại [app.config.ts#L11](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/app.config.ts#L11) - auto apply cho mọi requests

---

##### **Bước 5: Backend - AuthController Nhận Request**
📂 **File**: `Controllers/AuthController.cs`  
🌐 **Route**: `POST /api/auth/login`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/AuthController.cs#L18-L29)

```csharp
// File: AuthController.cs
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
{
    try
    {
        var token = await _authService.LoginAsync(loginDto);
        return Ok(new { Token = token });
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}
```

**Giải thích**: 
- **`[HttpPost("login")]`**: Attribute định nghĩa route `POST /api/auth/login`
- **`[FromBody] LoginDto`**: Model binding - deserialize JSON request body thành LoginDto object
- **`await _authService.LoginAsync()`**: Gọi business logic layer để verify credentials ([AuthService.cs#L21](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/AuthService.cs#L21))
- **Response**: Success → `200 OK {Token}` | Failure → `400 Bad Request {Error message}`
- **Try-catch**: Bắt exceptions từ service layer (invalid credentials, DB errors, etc.)

---

##### **Bước 6: AuthService.LoginAsync() - Verify User**
📂 **File**: `Services/AuthService.cs`  
🗄️ **Database**: Query bảng `Users`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/AuthService.cs#L21-L29)

```csharp
// File: AuthService.cs
public async Task<string> LoginAsync(LoginDto loginDto)
{
    var user = await _context.Users
        .FirstOrDefaultAsync(u => u.Username == loginDto.Username);
    
    if (user == null || user.PasswordHash != HashPassword(loginDto.Password))
    {
        throw new UnauthorizedAccessException("Invalid username or password.");
    }

    return _tokenService.GenerateToken(user);
}
```

**SQL được generate bởi EF Core**:
```sql
SELECT * FROM Users WHERE Username = 'customer1' LIMIT 1;
```

**Giải thích**: 
- **`FirstOrDefaultAsync()`**: EF Core LINQ query Users table, return first match hoặc null
- **Password verification**: Hash input password ([HashPassword#L52](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/AuthService.cs#L52)) → so sánh với DB `PasswordHash`
- **Validation**: User null hoặc password sai → throw `UnauthorizedAccessException` (catch ở Controller)
- **Token generation**: Credentials đúng → gọi [TokenService.GenerateToken()](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/TokenService.cs) → return JWT string

---

##### **Bước 7: HashPassword() - SHA256**
📂 **File**: `Services/AuthService.cs`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/AuthService.cs#L52-L57)

```csharp
// File: AuthService.cs
private string HashPassword(string password)
{
    using var sha256 = SHA256.Create();
    var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
    return Convert.ToBase64String(bytes);
}
```

**Giải thích**: 
- **`SHA256.Create()`**: .NET crypto library - hash algorithm (one-way, deterministic)
- **Process**: Password string → UTF8 bytes → SHA256 hash → Base64 string (để lưu DB)
- **Usage**: Login verification ([L26](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/AuthService.cs#L26)) | Registration ([L40](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/AuthService.cs#L40))
- **⚠️ Note**: SHA256 không ideal cho passwords (nên dùng BCrypt/Argon2 có salt), đủ cho demo

---

##### **Bước 8: TokenService.GenerateToken() - Tạo JWT**
📂 **File**: `Services/TokenService.cs`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/TokenService.cs)

```csharp
// File: TokenService.cs
public string GenerateToken(User user)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.EmailAddress, user.Email),
        new Claim(ClaimTypes.Role, user.Role.ToString())
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.Now.AddHours(24),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

**Giải thích**: 
- **Claims**: Payload chứa user data (ID, Username, Email, Role) - Frontend sẽ decode để lấy info
- **Secret Key**: Đọc từ [appsettings.json](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/appsettings.json) `Jwt:Key` → tạo `SymmetricSecurityKey`
- **SigningCredentials**: HMAC-SHA256 algorithm để sign token (verify integrity)
- **JwtSecurityToken**: Object chứa issuer, audience, claims, expiry (24h), signing credentials
- **Return**: Serialize token thành string format `header.payload.signature` (gửi về Frontend)

---

#### **Backend → Frontend (Response Flow)**

##### **Response được trả về**
🌐 **HTTP Response**: `200 OK` từ `/api/auth/login`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI1IiwidW5pcXVlX25hbWUiOiJjdXN0b21lcjEiLCJlbWFpbCI6ImN1c3RvbWVyMUBleGFtcGxlLmNvbSIsInJvbGUiOiJDdXN0b21lciIsIm5iZiI6MTcwMzY0MDAwMCwiZXhwIjoxNzAzNzI2NDAwLCJpYXQiOjE3MDM2NDAwMDAsImlzcyI6IlNlY29uZEhhbmRTeXN0ZW0iLCJhdWQiOiJTZWNvbmRIYW5kQ2xpZW50In0.signature"
}
```

##### **Frontend xử lý response**
📂 **File**: `ClientApp/src/app/core/services/auth.service.ts`

Quay lại `AuthService.login()` - phần `pipe(map())`:
```typescript
.pipe(map(response => {
    const token = response.token;
    const user = this.decodeToken(token);  // ← Decode JWT
    sessionStorage.setItem('currentUser', JSON.stringify(user));  // ← Lưu storage
    this.currentUserSubject.next(user);    // ← Emit state (trigger UI update)
    return token;
}))
```

##### **Component nhận kết quả**
📂 **File**: `ClientApp/src/app/features/auth/login/login.component.ts`

```typescript
.subscribe({
    next: () => {
        this.router.navigate([this.returnUrl]);  // ← Navigate to home
    },
    error: (err) => {
        this.error = 'Invalid username or password';
    }
});
```

**Kết quả cuối cùng**: 
- User thấy trang Home
  - 📍 **Navigate tới**: [login.component.ts#L32](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/auth/login/login.component.ts#L32)
  - 📍 **Route**: Defined in [app.routes.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/app.routes.ts)
- Status đã login, header hiển thị username ✅
  - 📍 **State update**: BehaviorSubject emit tại [auth.service.ts#L29](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/auth.service.ts#L29)
  - 📍 **UI listen**: Components subscribe to `currentUser$`

---

### 📋 **Tổng Kết Toàn Bộ Flow Login**

#### **🎬 Hành Trình Từ User Click → Kết Quả**

```
👤 USER                           📱 FRONTEND                        🔧 BACKEND                         🗄️ DATABASE
│                                 │                                  │                                  │
│ 1️⃣ Nhập username & password   │                                  │                                  │
│ 2️⃣ Click "Login" button        │                                  │                                  │
│                                 │                                  │                                  │
│──────────────────────────────→ │ login.component.html             │                                  │
│                                 │ ├─ (ngSubmit)="onSubmit()"       │                                  │
│                                 │ │                                │                                  │
│                                 │ login.component.ts               │                                  │
│                                 │ ├─ onSubmit() L28                │                                  │
│                                 │ └─ authService.login()           │                                  │
│                                 │      │                           │                                  │
│                                 │ auth.service.ts                  │                                  │
│                                 │ ├─ http.post() L25               │                                  │
│                                 │ └───────────────────────────────→│ AuthController.cs                │
│                                 │                                  │ ├─ [HttpPost("login")] L18       │
│                                 │                                  │ ├─ Nhận LoginDto                 │
│                                 │                                  │ └─ authService.LoginAsync()      │
│                                 │                                  │      │                           │
│                                 │                                  │ AuthService.cs                   │
│                                 │                                  │ ├─ LoginAsync() L21              │
│                                 │                                  │ └──────────────────────────────→│ Users table
│                                 │                                  │                                  │ SELECT WHERE Username = ?
│                                 │                                  │ ←─────────────────────────────┤ Return User
│                                 │                                  │ ├─ HashPassword() L52            │
│                                 │                                  │ ├─ Compare hashes                │
│                                 │                                  │ └─ tokenService.GenerateToken()  │
│                                 │                                  │      │                           │
│                                 │                                  │ TokenService.cs                  │
│                                 │                                  │ ├─ Create Claims                 │
│                                 │                                  │ ├─ Sign with HMAC-SHA256         │
│                                 │                                  │ └─ Return JWT token              │
│                                 │                                  │      │                           │
│                                 │ ←─────────────────────────────┤ Ok({Token: "eyJ..."})            │
│                                 │ Response 200 OK                  │                                  │
│                                 │                                  │                                  │
│                                 │ auth.service.ts                  │                                  │
│                                 │ ├─ pipe(map()) L26               │                                  │
│                                 │ ├─ decodeToken() L27             │                                  │
│                                 │ ├─ sessionStorage.setItem() L28  │                                  │
│                                 │ ├─ BehaviorSubject.next() L29    │                                  │
│                                 │ └─ Return token                  │                                  │
│                                 │      │                           │                                  │
│                                 │ login.component.ts               │                                  │
│                                 │ ├─ subscribe().next L31          │                                  │
│                                 │ └─ router.navigate(['/']) L32    │                                  │
│                                 │      │                           │                                  │
│ ←──────────────────────────────│ Navigate to Home Page            │                                  │
│ ✅ Thấy trang Home              │ Header shows username            │                                  │
│ ✅ Đã đăng nhập                 │                                  │                                  │
```

#### **📊 Thống Kê Các File Liên Quan**

| Loại | File | Vai Trò | Method Chính |
|------|------|---------|--------------|
| 📱 **Frontend UI** | [login.component.html](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/auth/login/login.component.html) | Form nhập liệu | `(ngSubmit)` event |
| 📱 **Frontend Logic** | [login.component.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/auth/login/login.component.ts#L28) | Xử lý submit | `onSubmit()` |
| 📱 **Frontend Service** | [auth.service.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/auth.service.ts#L24) | Gọi API | `login()` |
| 🔒 **Interceptor** | [jwt.interceptor.ts](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/interceptors/jwt.interceptor.ts) | Add token header | `jwtInterceptor` |
| 🔧 **Backend Controller** | [AuthController.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/AuthController.cs#L18) | Route handler | `Login()` |
| 🔧 **Backend Service** | [AuthService.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/AuthService.cs#L21) | Business logic | `LoginAsync()` |
| 🔧 **Token Service** | [TokenService.cs](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/TokenService.cs) | JWT generation | `GenerateToken()` |
| 🗄️ **Database** | MySQL | Data storage | `Users` table |

#### **⏱️ Timeline (Estimated)**

| Thời điểm | Sự kiện | File/Location |
|-----------|---------|---------------|
| T0 | User click "Login" | login.component.html |
| T0+10ms | `onSubmit()` triggered | login.component.ts |
| T0+20ms | HTTP POST sent | auth.service.ts → Backend |
| T0+50ms | Database query | AuthService.cs → MySQL |
| T0+60ms | Token generated | TokenService.cs |
| T0+70ms | Response returned | Backend → Frontend |
| T0+80ms | Token decoded & saved | auth.service.ts |
| T0+90ms | Navigate to Home | login.component.ts |
| T0+100ms | ✅ User sees Home page | Browser |

---

### 📍 Flow 2: BROWSE PRODUCTS (Xem Sản Phẩm)

#### **Frontend → Backend (Request Flow)**

##### **Bước 1: User Vào Trang Catalog**
👤 **User Action**: Click vào menu "Products" hoặc nhập URL `/catalog`

📂 **File**: `ClientApp/src/app/features/storefront/catalog/catalog.component.ts`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/storefront/catalog/catalog.component.ts#L35-L38)

```typescript
// File: catalog.component.ts
ngOnInit(): void {
    this.loadProducts();      // 👈 Tự động load products khi component init
    this.loadCategories();
}
```

**Giải thích**:
- **`ngOnInit()`**: Angular lifecycle hook - chạy sau khi component được khởi tạo
- **`loadProducts()`**: Method gọi ProductService để fetch danh sách sản phẩm
- Component tự động fetch data ngay khi user vào trang

---

##### **Bước 2: Apply Filters & Call ProductService**
📂 **File**: `ClientApp/src/app/features/storefront/catalog/catalog.component.ts`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/storefront/catalog/catalog.component.ts#L47-L55)

```typescript
// File: catalog.component.ts
loadProducts() {
    this.productService.getProducts(this.filters).subscribe({
        next: (data) => {
            this.allProducts = data;
            this.applyGenderFilter();  // Apply client-side filter
        },
        error: (err) => console.error('Failed to load products', err)
    });
}
```

**Giải thích**:
- **`this.filters`**: Object chứa keyword, minPrice, maxPrice, categoryId, condition
- **`getProducts(filters)`**: Gọi ProductService với filters → return Observable
- **`.subscribe()`**: Nhận array Products từ backend, assign vào `allProducts` để render

---

##### **Bước 3: ProductService.getProducts() - Build HTTP Request**
📂 **File**: `ClientApp/src/app/core/services/product.service.ts`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/product.service.ts#L12-L25)

```typescript
// File: product.service.ts
getProducts(filter?: ProductFilter): Observable<Product[]> {
    let params = new HttpParams();
    
    if (filter) {
        if (filter.keyword) params = params.set('keyword', filter.keyword);
        if (filter.minPrice) params = params.set('minPrice', filter.minPrice.toString());
        if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice.toString());
        if (filter.categoryId) params = params.set('categoryId', filter.categoryId.toString());
    }
    
    return this.http.get<Product[]>('/api/product', { params });
}
```

**Giải thích**:
- **`HttpParams`**: Angular class để build query string từ object
- **Conditional params**: Chỉ add vào URL nếu filter value tồn tại
- Final request: `GET /api/product?keyword=giay&categoryId=3&minPrice=100000`

---

##### **Bước 4: Backend - ProductController.GetProducts()**
📂 **File**: `Controllers/ProductController.cs`  
🌐 **Route**: `GET /api/product`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/ProductController.cs#L28-L32)

```csharp
// File: ProductController.cs
[HttpGet]
public async Task<IActionResult> GetProducts([FromQuery] ProductFilterDto filter)
{
    var products = await _productService.GetProductsAsync(filter);
    return Ok(products);
}
```

**Giải thích**:
- **`[FromQuery]`**: Model binding - parse query params thành ProductFilterDto object
- **`_productService.GetProductsAsync()`**: Delegate logic to service layer
- Return `200 OK` với JSON array of Products

---

##### **Bước 5: ProductRepository - Build Dynamic LINQ Query**
📂 **File**: `Repositories/ProductRepository.cs`  
🗄️ **Database**: Query bảng `Products` JOIN `Categories`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Repositories/ProductRepository.cs#L13-L51)

```csharp
// File: ProductRepository.cs
public async Task<IEnumerable<Product>> GetProductsAsync(
    string? keyword, decimal? minPrice, decimal? maxPrice, int? categoryId, string? condition)
{
    var query = _dbSet.AsQueryable();

    if (!string.IsNullOrWhiteSpace(keyword))
        query = query.Where(p => p.Name.Contains(keyword) || p.Description.Contains(keyword));
    
    if (minPrice.HasValue)
        query = query.Where(p => p.Price >= minPrice.Value);
    
    if (maxPrice.HasValue)
        query = query.Where(p => p.Price <= maxPrice.Value);
    
    if (categoryId.HasValue)
        query = query.Where(p => p.CategoryId == categoryId.Value);
    
    query = query.Include(p => p.Category);  // JOIN Categories table
    
    return await query.ToListAsync();
}
```

**SQL được generate bởi EF Core**:
```sql
SELECT p.*, c.*
FROM Products p
LEFT JOIN Categories c ON p.CategoryId = c.Id
WHERE (p.Name LIKE '%giay%' OR p.Description LIKE '%giay%')
  AND p.Price >= 100000
  AND p.CategoryId = 3
```

**Giải thích**:
- **Dynamic query**: Chain `.Where()` clauses chỉ cho filters có value
- **`.Include(p => p.Category)`**: EF Core eager loading - LEFT JOIN để lấy Category info
- **`.ToListAsync()`**: Execute query async → materialize results into `List<Product>`

---

** Backend Response - 200 OK**:
```json
[
  {
    "id": 6,
    "name": "Giày Sneaker Nike",
    "price": 250000,
    "condition": "New",
    "status": "Available",
    "categoryId": 3,
    "category": { "id": 3, "name": "Footwear" }
  }
]
```

**Result**: 👤 User thấy danh sách sản phẩm hiển thị ✅

---

### 📍 Flow 3: CHECKOUT (Đặt Hàng - Có Race Condition Handling)

##### **Bước 1: User Click "Place Order" Button**
👤 **User Action**: Nhập shipping address → Click button "Place Order"

📂 **File**: `ClientApp/src/app/features/storefront/checkout/checkout.component.ts`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/storefront/checkout/checkout.component.ts#L36-L94)

```typescript
// File: checkout.component.ts
placeOrder() {
    if (!this.shippingAddress) {
        this.errorMessage = 'Please enter a shipping address.';
        return;
    }

    const user = this.authService.currentUserValue;
    if (!user) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
        return;
    }

    this.isProcessing = true;
    const orderRequest: CreateOrderRequest = {
        userId: user.id,
        shippingAddress: this.shippingAddress,
        productIds: this.cartService.items.map(item => item.product.id)  // [6, 14]
    };

    this.orderService.checkout(orderRequest).subscribe({
        next: (order) => {
            this.cartService.clearCart();
            this.router.navigate(['/order-success'], { queryParams: { id: order.id } });
        },
        error: (err) => { /* Handle race condition */ }
    });
}
```

**Giải thích**:
- **Validation**: Check shipping address và user authentication
- **CreateOrderRequest**: Build request object với userId, address, productIds array
- **`cartService.items.map()`**: Extract product IDs từ cart items
- Success → Clear cart, navigate to success page

---

##### **Bước 2: OrderService.checkout() - POST Request**
📂 **File**: `ClientApp/src/app/core/services/order.service.ts`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/order.service.ts#L12-L14)

```typescript
// File: order.service.ts
checkout(orderRequest: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>('/api/order', orderRequest);
}
```

**HTTP Request**:
```http
POST /api/order
Authorization: Bearer eyJhbG...
Content-Type: application/json

{
  "userId": 5,
  "shippingAddress": "123 Quy Nhơn",
  "productIds": [6, 14]
}
```

**Giải thích**:
- Simple wrapper gọi `http.post()` với CreateOrderRequest
- JWT Interceptor tự động add Authorization header

---

##### **Bước 3: Backend - OrderController.Checkout()**
📂 **File**: `Controllers/OrderController.cs`  
🌐 **Route**: `POST /api/order`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/OrderController.cs#L21-L43)

```csharp
// File: OrderController.cs
[HttpPost]
[Authorize]
public async Task<IActionResult> Checkout([FromBody] CreateOrderDto dto)
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
    {
        return Unauthorized("User ID not found in token.");
    }

    if (dto.UserId != userId)
    {
        return Forbid();  // User trying to checkout for someone else
    }

    try
    {
        var order = await _orderService.CheckoutAsync(dto);
        return Ok(order);
    }
    catch (ProductSoldException ex)
    {
        return BadRequest(ex.Message);  // Race condition caught
    }
}
```

**Giải thích**:
- **`[Authorize]`**: Require valid JWT token
- **Security check**: Verify userId from token matches dto.UserId (prevent impersonation)
- **`CheckoutAsync()`**: Delegate to service layer với transaction handling
- **Catch ProductSoldException**: Handle race condition gracefully

---

##### **Bước 4: OrderService.CheckoutAsync() - CRITICAL SECTION ⚠️**
📂 **File**: `Services/OrderService.cs`  
🗄️ **Database**: INSERT Orders + OrderDetails với Transaction  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/OrderService.cs#L25-L99)

```csharp
// File: OrderService.cs
public async Task<Order> CheckoutAsync(CreateOrderDto input)
{
    using var transaction = await _context.Database.BeginTransactionAsync();  // 🔒 START
    try
    {
        var order = new Order
        {
            UserId = input.UserId,
            OrderDate = DateTime.UtcNow,
            ShippingAddress = input.ShippingAddress,
            Status = OrderStatus.Pending,
            OrderDetails = new List<OrderDetail>()
        };

        decimal totalAmount = 0;

        foreach (var productId in input.ProductIds)
        {
            var product = await _productRepository.GetByIdAsync(productId);
            
            // ⚡ CHECK 1: Product Status
            if (product.Status != ProductStatus.Available)
            {
                throw new ProductSoldException($"Product '{product.Name}' is already sold.");
            }

            // ⚡ CHECK 2: Product not in pending/shipping orders (RACE CONDITION PREVENTION)
            var existingOrders = await _context.Orders
                .Include(o => o.OrderDetails)
                .Where(o => (o.Status == OrderStatus.Pending || o.Status == OrderStatus.Shipping) &&
                           o.OrderDetails.Any(od => od.ProductId == productId))
                .AnyAsync();

            if (existingOrders)
            {
                throw new ProductSoldException($"Product '{product.Name}' is in another pending order.");
            }

            order.OrderDetails.Add(new OrderDetail
            {
                ProductId = productId,
                Price = product.Price  // Snapshot price at purchase time
            });
            totalAmount += product.Price;
        }

        order.TotalAmount = totalAmount;
        await _orderRepository.AddAsync(order);
        await _context.SaveChangesAsync();      // Execute SQL
        await transaction.CommitAsync();         // 🔒 COMMIT
        return order;
    }
    catch
    {
        await transaction.RollbackAsync();       // 🔒 ROLLBACK on error
        throw;
    }
}
```

**SQL được execute**:
```sql
-- Check pending orders
SELECT COUNT(*) 
FROM Orders o
JOIN OrderDetails od ON o.Id = od.OrderId
WHERE o.Status IN ('Pending', 'Shipping')
  AND od.ProductId = 6;

-- If no conflict, insert
BEGIN TRANSACTION;
INSERT INTO Orders (UserId, OrderDate, Status, TotalAmount, ShippingAddress)
VALUES (5, '2025-12-27 04:36:00', 'Pending', 250000, '123 Quy Nhơn');

INSERT INTO OrderDetails (OrderId, ProductId, Price)
VALUES (LAST_INSERT_ID(), 6, 250000);
COMMIT;
```

**Giải thích**:
- **Transaction**: Đảm bảo atomicity - cả Order + OrderDetails cùng succeed hoặc fail
- **Race Condition Check**: Query pending/shipping orders chứa product này
- **Two-phase validation**: Check Status + Check existing orders
- Product Status vẫn `Available` sau checkout (chỉ đổi `Sold` khi Admin Complete order)

---

##### **⚡ Race Condition Scenario Timeline**

```
⏱️ TIME    USER A                              USER B
──────────────────────────────────────────────────────────────────
T0         Click "Place Order"                 │
T1         BeginTransaction()                  │
              🔒 TX-A START                    │
T2         Check Product 6: Available ✅       │
T3         Check Pending Orders: None ✅       │
T4         │                                   Click "Place Order"
T5         │                                   BeginTransaction()
T6         │                                      🔒 TX-B START
T7         │                                   Check Product 6: Available ✅
T8         INSERT Order A                      │
T9         INSERT OrderDetail (Product 6)      │
T10        │                                   Check Pending Orders: FOUND! ❌
T11        │                                   throw ProductSoldException
T12        │                                   RollbackAsync()
T13        │                                      🔒 TX-B ROLLBACK ❌
T14        CommitAsync()                       │
              🔒 TX-A COMMIT ✅                │

RESULT:    Order A Created ✅                 Error Response ❌
           Product 6 → Order A                "Product in another pending order"
```

**Giải thích cơ chế**:
- **T2-T3**: User A checks pass vì chưa có pending order nào
- **T7**: User B cũng thấy Available vì TX-A chưa commit
- **T8-T9**: User A insert Order + OrderDetail
- **T10**: User B check lại → Phát hiện Order A (dù chưa committed, nhưng visible trong TX-A)
- **T11-T13**: User B rollback, throw exception
- **T14**: User A commit thành công

---

##### **Backend Response - Success Case (User A)**

```json
{
  "id": 30,
  "userId": 5,
  "orderDate": "2025-12-27T04:36:00Z",
  "totalAmount": 250000,
  "shippingAddress": "123 Quy Nhơn",
  "status": "Pending",
  "orderDetails": [
    {
      "productId": 6,
      "price": 250000
    }
  ]
}
```

**Frontend Handler**:
```typescript
next: (order) => {
    this.cartService.clearCart();
    this.router.navigate(['/order-success'], { queryParams: { id: order.id } });
}
```

**Result**: 👤 User A thấy "Order Success" page ✅

---

##### **Backend Response - Error Case (User B - Race Condition)**

```http
HTTP/1.1 400 Bad Request
Content-Type: text/plain

Product 'Giày Sneaker' is currently in another pending order.
```

**Frontend Error Handler**:
```typescript
error: (err) => {
    if (err.status === 409 || err.status === 400) {
        if (errorMsg.includes('already sold') || errorMsg.includes('unavailable')) {
            this.toastService.error('Sorry! One or more items in your cart have been purchased.');
            setTimeout(() => this.router.navigate(['/cart']), 2000);
        }
    }
}
```

**Result**: 👤 User B thấy toast error → redirect về /cart sau 2s ❌

---

### 📍 Flow 4: ADMIN UPDATE ORDER STATUS (Cập Nhật Trạng Thái Đơn Hàng)

##### **Bước 1: Admin Select New Status from Dropdown**
👤 **Admin Action**: Vào trang "Manage Orders" → Chọn status mới từ dropdown (e.g., "Completed")

📂 **File**: `ClientApp/src/app/features/admin/order-list/order-list.component.ts`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/admin/order-list/order-list.component.ts#L33-L89)

**Template (HTML)**:
```html
<!-- File: order-list.component.html -->
<select (change)="updateStatus(order.id, $event)" [value]="order.status">
  <option value="Pending">Pending</option>
  <option value="Shipping">Shipping</option>
  <option value="Completed">Completed</option>  <!-- 👈 Admin chọn option này -->
  <option value="Cancelled">Cancelled</option>
</select>
```

**Component Logic**:
```typescript
// File: order-list.component.ts
updateStatus(orderId: number, event: any) {
    const newStatus = event.target.value;  // "Completed"

    // Special handling for Completed status
    if (newStatus === 'Completed') {
        const message = `Complete this order?\n\nThis will mark products as SOLD.`;
        if (!confirm(message)) {
            event.target.value = order.status;  // Reset dropdown
            return;
        }
        this.performStatusUpdate(orderId, newStatus);
    }
}
```

**Giải thích**:
- **`(change)` event**: Trigger khi admin chọn option mới từ dropdown
- **Confirmation dialog**: Admin phải confirm trước khi mark Completed (vì sẽ set Products = Sold)
- **`performStatusUpdate()`**: Method gọi OrderService để update status

---

##### **Bước 2: Call OrderService.updateOrderStatus()**
📂 **File**: `ClientApp/src/app/features/admin/order-list/order-list.component.ts`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/admin/order-list/order-list.component.ts#L91-L103)

```typescript
// File: order-list.component.ts
performStatusUpdate(orderId: number, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
        next: () => {
            this.toastService.success('Order status updated successfully');
            this.loadOrders(); // Reload to get updated data
        },
        error: (error) => {
            const message = error.error?.message || 'Failed to update status';
            this.toastService.error(message);
            this.loadOrders(); // Reload to reset dropdown
        }
    });
}
```

**Giải thích**:
- **`orderService.updateOrderStatus()`**: Gọi service method với orderId và newStatus
- Success → Show toast, reload orders list
- Error → Show error message, reload to reset UI state

---

##### **Bước 3: OrderService.updateOrderStatus() - PUT Request**
📂 **File**: `ClientApp/src/app/core/services/order.service.ts`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/core/services/order.service.ts#L24-L27)

```typescript
// File: order.service.ts
updateOrderStatus(orderId: number, status: string): Observable<void> {
    return this.http.put<void>(`/api/order/${orderId}/status`, JSON.stringify(status), {
        headers: { 'Content-Type': 'application/json' }
    });
}
```

**HTTP Request**:
```http
PUT /api/order/30/status
Authorization: Bearer <admin-token>
Content-Type: application/json

"Completed"
```

**Giải thích**:
- **PUT request**: Update resource (order status)
- **`JSON.stringify(status)`**: Convert string to JSON body
- JWT Interceptor add Authorization header với admin token

---

##### **Bước 4: Backend - OrderController.UpdateOrderStatus()**
📂 **File**: `Controllers/OrderController.cs`  
🌐 **Route**: `PUT /api/order/{id}/status`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/OrderController.cs#L75-L81)

```csharp
// File: OrderController.cs
[HttpPut("{id}/status")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
{
    await _orderService.UpdateOrderStatusAsync(id, status);
    return NoContent();  // 204 No Content
}
```

**Giải thích**:
- **`[Authorize(Roles = "Admin")]`**: CHỈ Admin mới được gọi endpoint này
- **`[FromBody] string status`**: Deserialize JSON body thành string "Completed"
- **Return `NoContent()`**: 204 status code (success without response body)

---

##### **Bước 5: OrderService.UpdateOrderStatusAsync() - Update Order & Products**
📂 **File**: `Services/OrderService.cs`  
🗄️ **Database**: UPDATE Orders + UPDATE Products với Transaction  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/OrderService.cs#L158-L205)

```csharp
// File: OrderService.cs
public async Task UpdateOrderStatusAsync(int orderId, string status)
{
    using var transaction = await _context.Database.BeginTransactionAsync();  // 🔒 START
    try
    {
        var order = await _context.Orders
            .Include(o => o.OrderDetails)
            .ThenInclude(od => od.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            throw new Exception("Order not found.");
        }

        if (Enum.TryParse<OrderStatus>(status, out var orderStatus))
        {
            order.Status = orderStatus;

            // When order is marked as Completed, mark all products as Sold
            if (orderStatus == OrderStatus.Completed)
            {
                foreach (var detail in order.OrderDetails)
                {
                    if (detail.Product != null && detail.Product.Status == ProductStatus.Available)
                    {
                        detail.Product.Status = ProductStatus.Sold;
                        _productRepository.Update(detail.Product);
                    }
                }
            }

            _orderRepository.Update(order);
            await _context.SaveChangesAsync();      // Execute SQL
            await transaction.CommitAsync();         // 🔒 COMMIT
        }
        else
        {
            await transaction.RollbackAsync();
            throw new Exception("Invalid order status.");
        }
    }
    catch
    {
        await transaction.RollbackAsync();           // 🔒 ROLLBACK on error
        throw;
    }
}
```

**SQL được execute**:
```sql
-- Step 1: Query order với products
SELECT o.*, od.*, p.*
FROM Orders o
JOIN OrderDetails od ON o.Id = od.OrderId
JOIN Products p ON od.ProductId = p.Id
WHERE o.Id = 30;

-- Step 2: Update trong transaction
BEGIN TRANSACTION;

UPDATE Orders 
SET Status = 'Completed' 
WHERE Id = 30;

UPDATE Products 
SET Status = 'Sold' 
WHERE Id IN (6, 14);  -- Product IDs from OrderDetails

COMMIT;
```

**Giải thích**:
- **`.Include().ThenInclude()`**: Eager load Order → OrderDetails → Products (multi-level JOIN)
- **`Enum.TryParse()`**: Validate status string có phải valid OrderStatus enum không
- **Cascading update**: Khi Order = Completed → Set tất cả Products = Sold
- **Transaction**: Đảm bảo Order update và Products update cùng succeed hoặc fail

---

##### **Backend Response - 204 No Content**

```http
HTTP/1.1 204 No Content
```

**Frontend Handler**:
```typescript
next: () => {
    this.toastService.success('Order status updated successfully');
    this.loadOrders(); // Reload list để hiển thị status mới
}
```

**Result**: 👤 Admin thấy order status đổi từ "Pending" → "Completed" ✅  
Products liên quan tự động đổi sang "Sold" ✅

---

##### **⚠️ Business Logic: Status Transition Rules**

```
Pending ──────→ Shipping ──────→ Completed
   │                                   ↑
   └──────────→ Cancelled ←───────────┘

Completed Status Effect:
  ├─ Order.Status = "Completed"
  └─ ALL Products in Order:
       Available → Sold (permanent)
```

**Giải thích**:
- **Pending**: Order vừa tạo, chưa ship
- **Shipping**: Đang giao hàng
- **Completed**: Đã hoàn thành → Products = Sold (không thể hoàn tác)
- **Cancelled**: Order bị hủy → Products restore về Available

---

## 📊 Tóm Tắt Luồng Gọi Hàm

### Frontend Layers:
```
Component (UI Logic)
    ↓ calls
Service (Business Logic)
    ↓ calls
HttpClient (HTTP Request)
    ↓ intercepted by
JWT Interceptor (Add Token)
    ↓ sends
HTTP Request → Backend
```

### Backend Layers:
```
HTTP Request
    ↓ hits
Controller (Routing & Validation)
    ↓ calls
Service (Business Logic)
    ↓ calls
Repository (Data Access)
    ↓ calls
DbContext (EF Core)
    ↓ generates
SQL Query → Database
```

### Response Back:
```
Database Result
    ↓ mapped by
EF Core → Entity Objects
    ↓ returned to
Repository → Service → Controller
    ↓ serialized to
JSON Response
    ↓ sent to
Frontend HttpClient
    ↓ processed by
Observable.pipe(map())
    ↓ subscribed by
Component
    ↓ updates
UI (Template)
```
# QUẢN LÝ HỆ THỐNG - CÁC FLOWS CRUD

Tài liệu này mô tả chi tiết 4 nhóm chức năng quản lý: Product, Category, User, và Order Management.

---

## 📦 GROUP A: PRODUCT MANAGEMENT (Quản Lý Sản Phẩm)

### 📍 Flow 5: ADD PRODUCT (Thêm Sản Phẩm Mới)

##### **Bước 1: Admin Fill Product Form & Upload Image**
👤 **Admin Action**: Vào trang "Add Product" → Điền form → Chọn ảnh → Click "Create Product"

📂 **File**: `ClientApp/src/app/features/admin/add-product/add-product.component.ts`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/admin/add-product/add-product.component.ts#L56-L86)

```typescript
// File: add-product.component.ts
onSubmit() {
    if (!this.selectedFile) {
        alert('Please select an image.');
        return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('Name', this.product.name);
    formData.append('Price', this.product.price.toString());
    formData.append('OriginalPrice', this.product.originalPrice.toString());
    formData.append('Condition', this.product.condition);
    formData.append('Description', this.product.description);
    formData.append('CategoryId', this.product.categoryId.toString());
    formData.append('Gender', this.product.gender);
    formData.append('Size', this.product.size || '');
    formData.append('ImageFile', this.selectedFile);  // File object

    this.productService.createProduct(formData).subscribe({
        next: () => {
            alert('Product created successfully!');
            this.router.navigate(['/catalog']);
        },
        error: (err) => {
            console.error(err);
            alert('Failed to create product.');
        }
    });
}
```

**Giải thích**:
- **`FormData`**: Browser API để build multipart/form-data request (bắt buộc cho file upload)
- **`.append()`**: Thêm từng field vào FormData (giống object properties)
- **`this.selectedFile`**: File object từ `<input type="file">` event

---

##### **Bước 2: Backend - ProductController.CreateProduct()**
📂 **File**: `Controllers/ProductController.cs`  
🌐 **Route**: `POST /api/product`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/ProductController.cs#L130-L159)

```csharp
// File: ProductController.cs
[HttpPost]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> CreateProduct([FromForm] CreateProductDto dto)
{
    string? imageUrl = null;
    if (dto.ImageFile != null)
    {
        imageUrl = await _fileStorageService.SaveFileAsync(dto.ImageFile, "products");
    }

    var product = new Product
    {
        Name = dto.Name,
        Price = dto.Price,
        OriginalPrice = dto.OriginalPrice,
        Condition = dto.Condition,
        Description = dto.Description,
        ImageUrl = imageUrl,
        CategoryId = dto.CategoryId,
        Status = ProductStatus.Available,  // Default
        Gender = Enum.TryParse<ProductGender>(dto.Gender, true, out var gender) ? gender : ProductGender.Unisex,
        Size = dto.Size,
        CreatedDate = DateTime.UtcNow
    };

    await _repository.AddAsync(product);
    await _repository.SaveChangesAsync();
    return Ok(product);
}
```

**SQL**:
```sql
INSERT INTO Products (Name, Price, OriginalPrice, Condition, Description, ImageUrl, 
                      CategoryId, Status, Gender, Size, CreatedDate)
VALUES ('Áo Thun Nike', 150000, 200000, 'Like New', 'Description...', 
        '/uploads/products/ao-1.jpg', 2, 'Available', 'Male', 'M', '2025-12-28');
```

**Giải thích**:
- **`[FromForm]`**: Bind multipart/form-data thay vì JSON
- **FileStorageService**: Lưu file vào `/wwwroot/uploads/products/` → return relative path
- Default `Status = Available`, `CreatedDate = UtcNow`

---

### 📍 Flow 6: EDIT PRODUCT (Sửa Sản Phẩm)

##### **Bước 1: Load & Update Product**
📂 **File**: `ClientApp/src/app/features/admin/edit-product/edit-product.component.ts`  
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/ClientApp/src/app/features/admin/edit-product/edit-product.component.ts#L228-L265)

```typescript
// Load existing data
ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(this.productId).subscribe({
        next: (product) => {
            this.editForm.patchValue(product);
            this.currentImageUrl = product.imageUrl;
        }
    });
}

// Update submission
onSubmit() {
    const formData = new FormData();
    formData.append('Id', this.productId.toString());
    formData.append('Name', this.editForm.value.name);
    formData.append('Price', this.editForm.value.price.toString());
    // ... other fields
    
    if (this.selectedFile) {  // Optional new image
        formData.append('ImageFile', this.selectedFile);
    }

    this.productService.updateProductWithImage(this.productId, formData).subscribe({
        next: () => this.router.navigate(['/admin/products'])
    });
}
```

**Giải thích**:
- **`.patchValue()`**: Populate form với data hiện tại
- **Optional image**: Chỉ append nếu admin upload ảnh mới
- Backend giữ nguyên ImageUrl cũ nếu không có file

---

##### **Bước 2: Backend Update**
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/ProductController.cs#L43-L116)

```csharp
[HttpPut("{id}")]
public async Task<IActionResult> UpdateProduct(int id, [FromForm] UpdateProductDto dto, [FromForm] IFormFile? ImageFile)
{
    if (id != dto.Id) return BadRequest("ID mismatch");
    
    var existingProduct = await _repository.GetByIdAsync(id);
    if (existingProduct == null) return NotFound();

    // Update fields
    existingProduct.Name = dto.Name;
    existingProduct.Price = dto.Price;
    // ... update other fields
    
    if (ImageFile != null)  // Handle new image
    {
        string imageUrl = await _fileStorageService.SaveFileAsync(ImageFile, "products");
        existingProduct.ImageUrl = imageUrl;
    }

    _repository.Update(existingProduct);
    await _repository.SaveChangesAsync();
    return NoContent();
}
```

**Giải thích**:
- **Partial update**: Fetch existing → Update fields → Save
- Conditional image update chỉ khi có file mới

---

### 📍 Flow 7: DELETE PRODUCT (Xóa Sản Phẩm)

```typescript
// Frontend
deleteProduct(productId: number) {
    if (confirm('Delete this product?')) {
        this.productService.deleteProduct(productId).subscribe({
            next: () => this.loadProducts()
        });
    }
}
```

```csharp
// Backend
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteProduct(int id)
{
    var product = await _repository.GetByIdAsync(id);
    if (product == null) return NotFound();
    
    _repository.Delete(product);
    await _repository.SaveChangesAsync();
    return NoContent();
}
```

**SQL**: `DELETE FROM Products WHERE Id = 15;`

---

## 📁 GROUP B: CATEGORY MANAGEMENT (Quản Lý Danh Mục)

### 📍 Flow 8: ADD CATEGORY (Thêm Danh Mục)

```csharp
// Backend: CategoryController.cs
[HttpPost]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> CreateCategory([FromBody] Category category)
{
    await _categoryRepository.AddAsync(category);
    await _categoryRepository.SaveChangesAsync();
    return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
}
```

**SQL**:
```sql
INSERT INTO Categories (Name, Description) 
VALUES ('Electronics', 'Electronic items and gadgets');
```

**Giải thích**:
- Simple POCO entity (không có file upload)
- **`CreatedAtAction`**: Return `201 Created` với Location header

---

### 📍 Flow 9: EDIT CATEGORY (Sửa Danh Mục)

```csharp
// Backend: CategoryController.cs
[HttpPut("{id}")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
{
    if (id != category.Id) return BadRequest();
    
    var existing = await _categoryRepository.GetByIdAsync(id);
    if (existing == null) return NotFound();
    
    existing.Name = category.Name;
    existing.Description = category.Description;
    
    _categoryRepository.Update(existing);
    await _categoryRepository.SaveChangesAsync();
    return NoContent();
}
```

**SQL**:
```sql
UPDATE Categories 
SET Name = 'Electronics Updated', Description = 'New description' 
WHERE Id = 5;
```

---

## 👥 GROUP C: USER MANAGEMENT (Quản Lý Người Dùng)

### 📍 Flow 10: VIEW ALL USERS (Xem Danh Sách Users)

```csharp
// Backend: UserController.cs
[HttpGet]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> GetUsers()
{
    var users = await _context.Users
        .Select(u => new
        {
            u.Id,
            u.Username,
            u.Email,
            Role = u.Role.ToString(),
            u.Address,
            OrderCount = u.Orders.Count  // Aggregate count
        })
        .ToListAsync();

    return Ok(users);
}
```

**SQL**:
```sql
SELECT u.Id, u.Username, u.Email, u.Role, u.Address, COUNT(o.Id) as OrderCount
FROM Users u
LEFT JOIN Orders o ON u.Id = o.UserId
GROUP BY u.Id, u.Username, u.Email, u.Role, u.Address;
```

**Giải thích**:
- **Anonymous object**: Project chỉ fields cần thiết (không expose PasswordHash)
- **`.Select()`**: Transform entity → DTO
- **Aggregate**: Count số orders của mỗi user

---

### 📍 Flow 11: UPDATE USER ROLE (Đổi Quyền User)

```typescript
// Frontend
updateUserRole(userId: number, newRole: string) {
    this.userService.updateUserRole(userId, { role: newRole }).subscribe({
        next: () => {
            this.toastService.success('User role updated');
            this.loadUsers();
        }
    });
}
```

```csharp
// Backend: UserController.cs
[HttpPatch("{id}/role")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateRoleDto dto)
{
    var user = await _context.Users.FindAsync(id);
    if (user == null) return NotFound("User not found");

    if (Enum.TryParse<UserRole>(dto.Role, true, out var role))
    {
        user.Role = role;
        await _context.SaveChangesAsync();
        return Ok(new { message = "User role updated successfully" });
    }

    return BadRequest("Invalid role");
}
```

**SQL**:
```sql
UPDATE Users SET Role = 'Admin' WHERE Id = 25;
```

**Giải thích**:
- **`PATCH`**: Partial update (chỉ Role field)
- **`Enum.TryParse()`**: Validate role string ("Customer" | "Admin")

---

### 📍 Flow 12: DELETE USER (Xóa User)

```csharp
// Backend: UserController.cs
[HttpDelete("{id}")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> DeleteUser(int id)
{
    var user = await _context.Users.FindAsync(id);
    if (user == null) return NotFound("User not found");

    // Prevent deleting the last admin
    if (user.Role == UserRole.Admin)
    {
        var adminCount = await _context.Users.CountAsync(u => u.Role == UserRole.Admin);
        if (adminCount <= 1)
            return BadRequest("Cannot delete the last admin user");
    }

    _context.Users.Remove(user);
    await _context.SaveChangesAsync();
    return Ok(new { message = "User deleted successfully" });
}
```

**Giải thích**:
- **Safety check**: Không cho xóa admin cuối cùng (prevent lockout)
- **Foreign keys**: Nếu user có orders → cascade delete hoặc error

---

## 📦 GROUP D: ORDER MANAGEMENT (Quản Lý Đơn Hàng)

### 📍 Flow 13: VIEW MY ORDERS (Xem Đơn Hàng Của Mình)

```csharp
// Backend: OrderController.cs
[HttpGet("history")]
[Authorize]
public async Task<IActionResult> GetMyOrders()
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Unauthorized();

    int userId = int.Parse(userIdClaim.Value);
    var orders = await _orderService.GetMyOrdersAsync(userId);
    return Ok(orders);
}
```

**SQL**:
```sql
SELECT o.*, od.*, p.*
FROM Orders o
JOIN OrderDetails od ON o.Id = od.OrderId
JOIN Products p ON od.ProductId = p.Id
WHERE o.UserId = 5  -- From JWT token
ORDER BY o.OrderDate DESC;
```

**Giải thích**:
- **User-specific**: Chỉ xem orders của chính mình (userId from JWT)
- Include OrderDetails và Products để show đầy đủ info

---

### 📍 Flow 14: CANCEL ORDER (Hủy Đơn Hàng)

##### **Bước 1: Frontend Request**
```typescript
// Customer cancel own order
cancelOrder(orderId: number) {
    if (confirm('Cancel this order? Products will be restored.')) {
        this.orderService.cancelOrder(orderId, false).subscribe({
            next: (response) => {
                this.toastService.success(response.message);
                this.loadOrders();
            }
        });
    }
}
```

---

##### **Bước 2: Backend - OrderController**
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Controllers/OrderController.cs#L83-L128)

```csharp
// Admin cancel any order
[HttpPost("{id}/cancel")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> AdminCancelOrder(int id)
{
    try
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        int userId = int.Parse(userIdClaim.Value);
        await _orderService.CancelOrderAsync(id, userId, isAdmin: true);
        return Ok(new { message = "Order cancelled. Products restored." });
    }
    catch (UnauthorizedAccessException ex)
    {
        return Forbid(ex.Message);
    }
}

// Customer cancel own order
[HttpPost("{id}/customer-cancel")]
[Authorize]
public async Task<IActionResult> CustomerCancelOrder(int id)
{
    try
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        int userId = int.Parse(userIdClaim.Value);
        await _orderService.CancelOrderAsync(id, userId, isAdmin: false);
        return Ok(new { message = "Order cancelled. Products restored." });
    }
    catch (UnauthorizedAccessException ex)
    {
        return Forbid(ex.Message);
    }
}
```

**Giải thích**:
- **2 endpoints riêng**: Admin vs Customer
- **`isAdmin` flag**: Determine permission level

---

##### **Bước 3: OrderService.CancelOrderAsync() - Business Logic**
🔗 [Xem code](file:///c:/Users/MSI/CongNgheWeb/Final-Term/Second-hand_System/Services/OrderService.cs#L207-L274)

```csharp
// File: OrderService.cs
public async Task CancelOrderAsync(int orderId, int requestingUserId, bool isAdmin)
{
    using var transaction = await _context.Database.BeginTransactionAsync();
    try
    {
        var order = await _context.Orders
            .Include(o => o.OrderDetails)
            .ThenInclude(od => od.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null) throw new Exception("Order not found.");

        // Permission check
        if (!isAdmin && order.UserId != requestingUserId)
        {
            throw new UnauthorizedAccessException("You can only cancel your own orders.");
        }

        // Status validation
        if (order.Status == OrderStatus.Completed)
        {
            throw new Exception("Cannot cancel a completed order.");
        }

        if (order.Status == OrderStatus.Cancelled)
        {
            throw new Exception("Order is already cancelled.");
        }

        // Cancel the order
        order.Status = OrderStatus.Cancelled;
        _orderRepository.Update(order);

        // Restore products to Available (if they were marked as Sold)
        foreach (var detail in order.OrderDetails)
        {
            if (detail.Product != null && detail.Product.Status == ProductStatus.Sold)
            {
                detail.Product.Status = ProductStatus.Available;
                _productRepository.Update(detail.Product);
            }
        }

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
}
```

**SQL được execute**:
```sql
BEGIN TRANSACTION;

-- Step 1: Update order status
UPDATE Orders SET Status = 'Cancelled' WHERE Id = 30;

-- Step 2: Restore products
UPDATE Products 
SET Status = 'Available' 
WHERE Id IN (6, 14)  -- Products in order
  AND Status = 'Sold';

COMMIT;
```

**Giải thích**:
- **Permission check**: Customer chỉ cancel own orders, Admin cancel bất kỳ
- **Status validation**: 
  - ✅ Can cancel: Pending, Shipping
  - ❌ Cannot cancel: Completed, Cancelled
- **Cascading restore**: Products từ `Sold` → `Available`
- **Transaction**: Đảm bảo order update + products restore cùng succeed/fail

---

##### **⚠️ Business Rules**

```
Order Cancellation Rules:
├─ WHO can cancel:
│  ├─ Customer: Own orders only
│  └─ Admin: Any orders
│
├─ WHEN can cancel:
│  ├─ ✅ Pending orders
│  ├─ ✅ Shipping orders
│  ├─ ❌ Completed orders (permanent)
│  └─ ❌ Already cancelled orders
│
└─ EFFECTS:
   ├─ Order.Status → Cancelled
   └─ Products: Sold → Available (restore inventory)
```

---

## 📊 Tổng Kết Các Flows

| Group | Flow | Method | Endpoint | Role Required |
|-------|------|--------|----------|---------------|
| **A: Product** | Add Product | POST | `/api/product` | Admin |
| **A: Product** | Edit Product | PUT | `/api/product/{id}` | Admin |
| **A: Product** | Delete Product | DELETE | `/api/product/{id}` | Admin |
| **B: Category** | Add Category | POST | `/api/category` | Admin |
| **B: Category** | Edit Category | PUT | `/api/category/{id}` | Admin |
| **C: User** | View Users | GET | `/api/user` | Admin |
| **C: User** | Update Role | PATCH | `/api/user/{id}/role` | Admin |
| **C: User** | Delete User | DELETE | `/api/user/{id}` | Admin |
| **D: Order** | View My Orders | GET | `/api/order/history` | Any |
| **D: Order** | Admin Cancel | POST | `/api/order/{id}/cancel` | Admin |
| **D: Order** | Customer Cancel | POST | `/api/order/{id}/customer-cancel` | Any |

---

## 🎯 Patterns Chung

### **File Upload Pattern**
```typescript
// Frontend
const formData = new FormData();
formData.append('field', value);
formData.append('file', fileObject);

// Backend
[HttpPost]
public async Task<IActionResult> Upload([FromForm] Dto dto, [FromForm] IFormFile file)
```

### **Transaction Pattern**
```csharp
using var transaction = await _context.Database.BeginTransactionAsync();
try {
    // Multiple database operations
    await _context.SaveChangesAsync();
    await transaction.CommitAsync();
} catch {
    await transaction.RollbackAsync();
    throw;
}
```

### **Permission Check Pattern**
```csharp
var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
if (userIdClaim == null) return Unauthorized();

int userId = int.Parse(userIdClaim.Value);
if (!isAdmin && resource.UserId != userId)
    return Forbid();
```
