# Troubleshooting Admin Access & Product Detail Issues

## Issue 1: Admin Dashboard Not Visible

### Root Cause Analysis
The admin link should appear in the header when logged in as admin. The condition is:
```html
<li *ngIf="user.role === 'Admin'">
  <a routerLink="/admin/dashboard">Admin Dashboard</a>
</li>
```

### Debugging Steps
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run this command to check the stored user data:
   ```javascript
   console.log(JSON.parse(localStorage.getItem('currentUser')))
   ```
4. Check if the `role` field shows `"Admin"` (string) or `1` (number)

### Fix
If the role is showing as a number (like `1` or `0`), the issue is in the JWT decoding. Update `auth.service.ts` line 59:

**BEFORE:**
```typescript
role: payload.role,
```

**AFTER:**
```typescript
role: payload.role === 'Admin' ? 'Admin' : 'Customer',
```

---

## Issue 2: Product Detail Page Blank

### Root Cause Analysis
The product detail component uses Observable with async pipe:
```html
<div class="container py-5" *ngIf="product$ | async as product">
```

If `product$` is undefined or the API call fails, nothing will render.

### Debugging Steps
1. Open browser DevTools (F12) Network tab
2. Click on a product to open the detail page
3. Check if there's a failed API call to `/api/product/{id}`
4. Open Console tab and check for JavaScript errors

### Common Causes
- **Wrong route parameter**: URL should be `/catalog/3` not `/product/3`
- **API 404**: Product ID doesn't exist in database
- **CORS error**: Backend not running or proxy misconfigured

### Fix Options

#### Option A: Add Loading/Error State
Update `product-detail.component.html` to show loading and error messages:
```html
<div class="container py-5">
  <div *ngIf="product$ | async as product; else loading">
    <!-- existing content -->
  </div>
  
  <ng-template #loading>
    <div class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </ng-template>
</div>
```

#### Option B: Add Error Handling
Update `product-detail.component.ts`:
```typescript
ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  console.log('Product ID from route:', id); // Debug line
  if (id) {
    this.product$ = this.productService.getProduct(id).pipe(
      tap(product => console.log('Loaded product:', product)),
      catchError(err => {
        console.error('Failed to load product:', err);
        return of(null);
      })
    );
  }
}
```

---

## Quick Test Steps

### Test Admin Access
1. Login with:
   - Username: `admin`
   - Password: `Admin@123`
2. Check if "Admin Dashboard" link appears in header
3. If not, run the localStorage check from debugging steps above

### Test Product Detail
1. Go to Catalog page (`/catalog`)
2. Click any product card
3. URL should change to `/catalog/{id}`
4. Product detail page should load
5. If blank, check browser console for errors
