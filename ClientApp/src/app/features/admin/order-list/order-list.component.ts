import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { Order } from '../../../models/order.models';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-admin-order-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.css']
})
export class AdminOrderListComponent implements OnInit {
    orders$: Observable<Order[]> | undefined;

    constructor(
        private orderService: OrderService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders() {
        this.orders$ = this.orderService.getAllOrders();
    }

    updateStatus(orderId: number, event: any) {
        const newStatus = event.target.value;
        this.orderService.updateOrderStatus(orderId, newStatus).subscribe(() => {
            this.toastService.success('Order status updated successfully');
        });
    }

    cancelOrder(orderId: number) {
        if (!confirm('Are you sure you want to cancel this order? Products will be restored to available.')) {
            return;
        }

        this.orderService.cancelOrder(orderId, true).subscribe({
            next: (response) => {
                this.toastService.success(response.message || 'Order cancelled successfully!');
                this.loadOrders(); // Reload orders
            },
            error: (error) => {
                const message = error.error?.message || 'Failed to cancel order';
                this.toastService.error(message);
            }
        });
    }
}
