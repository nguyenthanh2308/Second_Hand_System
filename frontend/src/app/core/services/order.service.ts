import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateOrderRequest, Order } from '../../models/order.models';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private http: HttpClient) { }

    checkout(orderRequest: CreateOrderRequest): Observable<Order> {
        return this.http.post<Order>('/api/order', orderRequest);
    }

    getMyOrders(): Observable<Order[]> {
        return this.http.get<Order[]>('/api/order/history');
    }

    getAllOrders(): Observable<Order[]> {
        return this.http.get<Order[]>('/api/order/all');
    }

    updateOrderStatus(id: number, status: string): Observable<void> {
        return this.http.put<void>(`/api/order/${id}/status`, JSON.stringify(status), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    cancelOrder(id: number, isAdmin: boolean = false): Observable<any> {
        const endpoint = isAdmin ? `/api/order/${id}/cancel` : `/api/order/${id}/customer-cancel`;
        return this.http.post<any>(endpoint, {});
    }
}
