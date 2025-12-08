import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../models/order.models';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-order-history',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
    orders$: Observable<Order[]> | undefined;
    orders: Order[] = [];
    filteredOrders: Order[] = [];
    activeStatus: string = 'All';
    expandedOrderIds: Set<number> = new Set<number>();

    constructor(private orderService: OrderService) { }

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
}
