import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="container-fluid">
        <h2 class="mb-4">Dashboard</h2>

        <!-- Stats Cards -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card bg-primary text-white shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-uppercase mb-1 opacity-75">Total Products</h6>
                                <h2 class="mb-0">{{ stats.totalProducts }}</h2>
                            </div>
                            <i class="fas fa-box fa-2x opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-success text-white shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-uppercase mb-1 opacity-75">Available</h6>
                                <h2 class="mb-0">{{ stats.availableProducts }}</h2>
                            </div>
                            <i class="fas fa-check-circle fa-2x opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-warning text-dark shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-uppercase mb-1 opacity-75">Pending Orders</h6>
                                <h2 class="mb-0">{{ stats.pendingOrders }}</h2>
                            </div>
                            <i class="fas fa-clock fa-2x opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-info text-white shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-uppercase mb-1 opacity-75">Total Revenue</h6>
                                <h2 class="mb-0">{{ stats.totalRevenue | currency:'VND':'symbol':'1.0-0' }}</h2>
                            </div>
                            <i class="fas fa-dollar-sign fa-2x opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card shadow-sm">
                    <div class="card-header bg-white">
                        <h5 class="mb-0">Quick Actions</h5>
                    </div>
                    <div class="card-body">
                        <a routerLink="/admin/products/add" class="btn btn-primary me-2">
                            <i class="fas fa-plus"></i> Add Product
                        </a>
                        <a routerLink="/admin/products" class="btn btn-outline-primary me-2">
                            <i class="fas fa-list"></i> Manage Products
                        </a>
                        <a routerLink="/admin/orders" class="btn btn-outline-primary me-2">
                            <i class="fas fa-shopping-cart"></i> View Orders
                        </a>
                        <a routerLink="/admin/categories" class="btn btn-outline-primary me-2">
                            <i class="fas fa-tags"></i> Manage Categories
                        </a>
                        <a routerLink="/admin/users" class="btn btn-outline-primary">
                            <i class="fas fa-users"></i> Manage Users
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sales Reports Section -->
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-header bg-white">
                        <h5 class="mb-0">📊 Order Status Breakdown</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-1">
                                <span>Pending</span>
                                <strong class="text-warning">{{ orderStatusBreakdown.pending }}</strong>
                            </div>
                            <div class="progress" style="height: 8px;">
                                <div class="progress-bar bg-warning" [style.width.%]="getPercentage(orderStatusBreakdown.pending)"></div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-1">
                                <span>Shipping</span>
                                <strong class="text-info">{{ orderStatusBreakdown.shipping }}</strong>
                            </div>
                            <div class="progress" style="height: 8px;">
                                <div class="progress-bar bg-info" [style.width.%]="getPercentage(orderStatusBreakdown.shipping)"></div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-1">
                                <span>Completed</span>
                                <strong class="text-success">{{ orderStatusBreakdown.completed }}</strong>
                            </div>
                            <div class="progress" style="height: 8px;">
                                <div class="progress-bar bg-success" [style.width.%]="getPercentage(orderStatusBreakdown.completed)"></div>
                            </div>
                        </div>
                        <div>
                            <div class="d-flex justify-content-between mb-1">
                                <span>Cancelled</span>
                                <strong class="text-danger">{{ orderStatusBreakdown.cancelled }}</strong>
                            </div>
                            <div class="progress" style="height: 8px;">
                                <div class="progress-bar bg-danger" [style.width.%]="getPercentage(orderStatusBreakdown.cancelled)"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-header bg-white">
                        <h5 class="mb-0">💰 Revenue Statistics</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3 pb-2 border-bottom">
                            <small class="text-muted">Total Revenue (All Time)</small>
                            <h3 class="mb-0 text-success">{{ stats.totalRevenue | currency:'VND':'symbol':'1.0-0' }}</h3>
                        </div>
                        <div class="mb-3 pb-2 border-bottom">
                            <small class="text-muted">Completed Orders</small>
                            <h4 class="mb-0">{{ orderStatusBreakdown.completed }} orders</h4>
                        </div>
                        <div>
                            <small class="text-muted">Average Order Value</small>
                            <h4 class="mb-0">{{ getAverageOrderValue() | currency:'VND':'symbol':'1.0-0' }}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Orders -->
        <div class="row">
            <div class="col-12">
                <div class="card shadow-sm">
                    <div class="card-header bg-white d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Recent Orders</h5>
                        <a routerLink="/admin/orders" class="btn btn-sm btn-outline-primary">View All</a>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-hover mb-0">
                            <thead class="bg-light">
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr *ngFor="let order of recentOrders">
                                    <td>#{{ order.id }}</td>
                                    <td>{{ order.orderDate | date:'short' }}</td>
                                    <td>{{ order.totalAmount | currency:'VND':'symbol':'1.0-0' }}</td>
                                    <td>
                                        <span class="badge" [ngClass]="{
                                            'bg-warning': order.status === 'Pending',
                                            'bg-primary': order.status === 'Shipping',
                                            'bg-success': order.status === 'Completed',
                                            'bg-danger': order.status === 'Cancelled'
                                        }">{{ order.status }}</span>
                                    </td>
                                </tr>
                                <tr *ngIf="recentOrders.length === 0">
                                    <td colspan="4" class="text-center py-3 text-muted">No recent orders</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    styles: [`
        .card { border: none; border-radius: 10px; }
        .opacity-50 { opacity: 0.5; }
        .opacity-75 { opacity: 0.75; }
    `]
})
export class DashboardComponent implements OnInit {
    stats = {
        totalProducts: 0,
        availableProducts: 0,
        pendingOrders: 0,
        totalRevenue: 0
    };
    orderStatusBreakdown = {
        pending: 0,
        shipping: 0,
        completed: 0,
        cancelled: 0,
        total: 0
    };
    recentOrders: any[] = [];

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loadStats();
    }

    loadStats(): void {
        forkJoin({
            products: this.http.get<any[]>('/api/product'),
            orders: this.http.get<any[]>('/api/order/all')
        }).subscribe({
            next: (data) => {
                this.stats.totalProducts = data.products.length;
                this.stats.availableProducts = data.products.filter(p => p.status === 'Available').length;
                this.stats.pendingOrders = data.orders.filter(o => o.status === 'Pending').length;
                this.stats.totalRevenue = data.orders
                    .filter(o => o.status === 'Completed')
                    .reduce((sum, o) => sum + o.totalAmount, 0);
                this.recentOrders = data.orders.slice(0, 5);

                // Calculate order status breakdown
                this.orderStatusBreakdown.pending = data.orders.filter(o => o.status === 'Pending').length;
                this.orderStatusBreakdown.shipping = data.orders.filter(o => o.status === 'Shipping').length;
                this.orderStatusBreakdown.completed = data.orders.filter(o => o.status === 'Completed').length;
                this.orderStatusBreakdown.cancelled = data.orders.filter(o => o.status === 'Cancelled').length;
                this.orderStatusBreakdown.total = data.orders.length;
            },
            error: (err) => console.error('Failed to load stats', err)
        });
    }

    getPercentage(value: number): number {
        return this.orderStatusBreakdown.total > 0
            ? (value / this.orderStatusBreakdown.total) * 100
            : 0;
    }

    getAverageOrderValue(): number {
        return this.orderStatusBreakdown.completed > 0
            ? this.stats.totalRevenue / this.orderStatusBreakdown.completed
            : 0;
    }
}
