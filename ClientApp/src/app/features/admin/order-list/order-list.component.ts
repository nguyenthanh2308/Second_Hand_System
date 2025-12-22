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

        // Special handling for Completed status
        if (newStatus === 'Completed') {
            // Get the order to check products
            this.orderService.getAllOrders().subscribe(orders => {
                const order = orders.find(o => o.id === orderId);
                if (!order) return;

                const productCount = order.orderDetails?.length || 0;
                const soldProducts = order.orderDetails?.filter(d =>
                    d.product && d.product.status === 'Sold'
                ).length || 0;

                let message = `Complete this order?\n\n`;
                message += `This will mark ${productCount} product(s) as SOLD.\n`;

                if (soldProducts > 0) {
                    message += `\n⚠️ WARNING: ${soldProducts} product(s) are already sold!\n`;
                    message += `This may cause issues with inventory.`;
                }

                if (!confirm(message)) {
                    // Reset dropdown to previous value
                    event.target.value = order.status;
                    return;
                }

                this.performStatusUpdate(orderId, newStatus);
            });
        } else {
            this.performStatusUpdate(orderId, newStatus);
        }
    }

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
