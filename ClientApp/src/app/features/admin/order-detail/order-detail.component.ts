import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Order } from '../../../models/order.models';

@Component({
    selector: 'app-order-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Order Details #{{ order?.id }}</h2>
            <a routerLink="/admin/orders" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Back to Orders
            </a>
        </div>

        <div class="row" *ngIf="order">
            <!-- Order Info -->
            <div class="col-md-8">
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-white">
                        <h5 class="mb-0">Order Items</h5>
                    </div>
                    <div class="card-body p-0">
                        <table class="table mb-0">
                            <thead class="bg-light">
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr *ngFor="let detail of order.orderDetails">
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img [src]="detail.product?.imageUrl || 'assets/placeholder.png'" 
                                                 class="rounded me-3" style="width:50px;height:50px;object-fit:cover">
                                            <div>
                                                <strong>{{ detail.product?.name || 'Product #' + detail.productId }}</strong>
                                                <br><small class="text-muted">{{ detail.product?.condition }}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{{ detail.price | currency:'VND':'symbol':'1.0-0' }}</td>
                                </tr>
                            </tbody>
                            <tfoot class="bg-light">
                                <tr>
                                    <td><strong>Total</strong></td>
                                    <td><strong class="text-primary">{{ order.totalAmount | currency:'VND':'symbol':'1.0-0' }}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Order Summary -->
            <div class="col-md-4">
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-white">
                        <h5 class="mb-0">Order Summary</h5>
                    </div>
                    <div class="card-body">
                        <p><strong>Order ID:</strong> #{{ order.id }}</p>
                        <p><strong>Date:</strong> {{ order.orderDate | date:'medium' }}</p>
                        <p><strong>Customer ID:</strong> {{ order.userId }}</p>
                        <p>
                            <strong>Status:</strong>
                            <span class="badge ms-2" [ngClass]="{
                                'bg-warning': order.status === 'Pending',
                                'bg-primary': order.status === 'Shipping',
                                'bg-success': order.status === 'Completed',
                                'bg-danger': order.status === 'Cancelled'
                            }">{{ order.status }}</span>
                        </p>
                    </div>
                </div>

                <div class="card shadow-sm">
                    <div class="card-header bg-white">
                        <h5 class="mb-0">Shipping Address</h5>
                    </div>
                    <div class="card-body">
                        <p class="mb-0">{{ order.shippingAddress || 'No address provided' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <div *ngIf="error" class="alert alert-danger">
            {{ error }}
        </div>
    </div>
    `,
    styles: []
})
export class OrderDetailComponent implements OnInit {
    order: Order | null = null;
    loading = true;
    error = '';

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadOrder(parseInt(id));
        }
    }

    loadOrder(id: number): void {
        this.http.get<Order>(`/api/order/${id}`).subscribe({
            next: (order) => {
                this.order = order;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load order details';
                this.loading = false;
                console.error(err);
            }
        });
    }
}
