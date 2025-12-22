import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { Order } from '../../../models/order.models';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-order-history',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
    orders$: Observable<Order[]> | undefined;
    orders: Order[] = [];
    filteredOrders: Order[] = [];
    activeStatus: string = 'All';
    expandedOrderIds: Set<number> = new Set<number>();

    constructor(
        private orderService: OrderService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.orders$ = this.orderService.getMyOrders();
        this.orders$.subscribe(data => {
            this.orders = data;
            this.filterOrders();
        });
    }

    setStatus(status: string) {
        this.activeStatus = status;
        this.filterOrders();
    }

    filterOrders() {
        if (this.activeStatus === 'All') {
            this.filteredOrders = this.orders;
        } else {
            this.filteredOrders = this.orders.filter(o => o.status === this.activeStatus);
        }
    }

    toggleDetails(orderId: number) {
        if (this.expandedOrderIds.has(orderId)) {
            this.expandedOrderIds.delete(orderId);
        } else {
            this.expandedOrderIds.add(orderId);
        }
    }

    isExpanded(orderId: number): boolean {
        return this.expandedOrderIds.has(orderId);
    }

    cancelOrder(orderId: number) {
        if (!confirm('Are you sure you want to cancel this order? Products will be restored to available.')) {
            return;
        }

        this.orderService.cancelOrder(orderId, false).subscribe({
            next: (response) => {
                this.toastService.success(response.message || 'Order cancelled successfully!');
                // Reload orders
                this.orderService.getMyOrders().subscribe(data => {
                    this.orders = data;
                    this.filterOrders();
                });
            },
            error: (error) => {
                const message = error.error?.message || 'Failed to cancel order';
                this.toastService.error(message);
            }
        });
    }
}
