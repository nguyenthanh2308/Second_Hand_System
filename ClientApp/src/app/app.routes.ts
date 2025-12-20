import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './features/storefront/home/home.component';
import { CatalogComponent } from './features/storefront/catalog/catalog.component';
import { ProductDetailComponent } from './features/storefront/product-detail/product-detail.component';
import { CartComponent } from './features/storefront/cart/cart.component';
import { CheckoutComponent } from './features/storefront/checkout/checkout.component';
import { OrderSuccessComponent } from './features/storefront/order-success/order-success.component';
import { OrderFailedComponent } from './features/storefront/order-failed/order-failed.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AddProductComponent } from './features/admin/add-product/add-product.component';
import { AdminProductListComponent } from './features/admin/product-list/product-list.component';
import { AdminOrderListComponent } from './features/admin/order-list/order-list.component';
import { EditProductComponent } from './features/admin/edit-product/edit-product.component';
import { CategoryListComponent } from './features/admin/category-list/category-list.component';
import { OrderDetailComponent } from './features/admin/order-detail/order-detail.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { OrderHistoryComponent } from './features/customer/order-history/order-history.component';
import { UserListComponent } from './features/admin/user-list/user-list.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // Main Layout Routes (Storefront)
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'catalog', component: CatalogComponent },
            { path: 'catalog/:id', component: ProductDetailComponent },
            { path: 'cart', component: CartComponent },
            { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
            { path: 'order-success', component: OrderSuccessComponent, canActivate: [authGuard] },
            { path: 'order-failed', component: OrderFailedComponent, canActivate: [authGuard] },
            { path: 'orders', component: OrderHistoryComponent, canActivate: [authGuard] },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
        ]
    },

    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        data: { roles: ['Admin'] },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'products', component: AdminProductListComponent },
            { path: 'products/add', component: AddProductComponent },
            { path: 'products/edit/:id', component: EditProductComponent },
            { path: 'categories', component: CategoryListComponent },
            { path: 'orders', component: AdminOrderListComponent },
            { path: 'orders/:id', component: OrderDetailComponent },
            { path: 'users', component: UserListComponent },
        ]
    },

    { path: '**', redirectTo: '' }
];
