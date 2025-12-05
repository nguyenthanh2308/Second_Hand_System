import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent {
    cartItems$: Observable<CartItem[]>;

    constructor(public cartService: CartService) {
        this.cartItems$ = this.cartService.cartItems$;
    }

    removeItem(productId: number) {
        this.cartService.removeFromCart(productId);
    }
}
