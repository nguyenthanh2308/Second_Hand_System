import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../models/product.models';
import { ToastService } from './toast.service';

export interface CartItem {
    product: Product;
    quantity: number; // For second-hand, usually 1, but let's keep it generic
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
    public cartItems$ = this.cartItemsSubject.asObservable();

    constructor(private toastService: ToastService) {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            this.cartItemsSubject.next(JSON.parse(storedCart));
        }
    }

    addToCart(product: Product) {
        const currentItems = this.cartItemsSubject.value;
        const existingItem = currentItems.find(item => item.product.id === product.id);

        if (existingItem) {
            // For second-hand, maybe prevent > 1? But let's allow for now or just alert.
            // existingItem.quantity++; 
            this.toastService.warning('This item is already in your cart.');
        } else {
            currentItems.push({ product, quantity: 1 });
            this.updateCart(currentItems);
            this.toastService.success('Added to cart!');
        }
    }

    removeFromCart(productId: number) {
        const currentItems = this.cartItemsSubject.value.filter(item => item.product.id !== productId);
        this.updateCart(currentItems);
    }

    clearCart() {
        this.updateCart([]);
    }

    private updateCart(items: CartItem[]) {
        this.cartItemsSubject.next(items);
        localStorage.setItem('cart', JSON.stringify(items));
    }

    get totalAmount(): number {
        return this.cartItemsSubject.value.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }

    get items(): CartItem[] {
        return this.cartItemsSubject.value;
    }
}
