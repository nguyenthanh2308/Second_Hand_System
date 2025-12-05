import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { CreateOrderRequest } from '../../../models/order.models';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
    shippingAddress: string = '';
    errorMessage: string = '';
    isProcessing: boolean = false;

    constructor(
        public cartService: CartService,
        private orderService: OrderService,
        private authService: AuthService,
        private router: Router
    ) {
        const user = this.authService.currentUserValue;
        if (user && user.address) {
            this.shippingAddress = user.address;
        }
    }

    placeOrder() {
        if (!this.shippingAddress) {
            this.errorMessage = 'Please enter a shipping address.';
            return;
        }

        const user = this.authService.currentUserValue;
        if (!user) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
            return;
        }

        this.isProcessing = true;
        this.errorMessage = '';

        const orderRequest: CreateOrderRequest = {
            userId: user.id,
            shippingAddress: this.shippingAddress,
            productIds: this.cartService.items.map(item => item.product.id)
        };

        this.orderService.checkout(orderRequest).subscribe({
            next: (order) => {
                this.isProcessing = false;
                this.cartService.clearCart();
                // Redirect to Success Page
                this.router.navigate(['/order-success'], { queryParams: { id: order.id } });
            },
            error: (err) => {
                this.isProcessing = false;
                if (err.status === 409 || err.status === 400) {
                    // Redirect to Failed Page for Race Condition
                    this.router.navigate(['/order-failed']);
                } else {
                    this.errorMessage = 'An error occurred while placing your order. Please try again.';
                }
            }
        });
    }
}
