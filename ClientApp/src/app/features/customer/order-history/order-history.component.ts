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

    constructor(private orderService: OrderService) { }

    ngOnInit(): void {
        this.orders$ = this.orderService.getMyOrders();
    }
}
