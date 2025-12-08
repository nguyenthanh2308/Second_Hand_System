import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
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

    constructor(private orderService: OrderService) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders() {
        this.orders$ = this.orderService.getAllOrders();
    }

    updateStatus(orderId: number, event: any) {
        const newStatus = event.target.value;
        this.orderService.updateOrderStatus(orderId, newStatus).subscribe(() => {
            // Optional: Show success toast
            console.log('Order status updated');
        });
    }
}
