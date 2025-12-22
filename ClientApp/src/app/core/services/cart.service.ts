import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../models/product.models';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';

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

    constructor(
        private toastService: ToastService,
        private authService: AuthService
    ) {
        // Load cart for logged-in user
        this.loadCartForCurrentUser();

        // Subscribe to auth changes to reload cart when user changes
        this.authService.currentUser$.subscribe(user => {
            this.loadCartForCurrentUser();
        });
    }

    private getCartKey(): string {
        const currentUser = this.authService.currentUserValue;
        if (currentUser && currentUser.id) {
            return `cart_user_${currentUser.id}`;
        }
        return 'cart_guest'; // Fallback for non-logged-in users (shouldn't happen with login requirement)
    }

    private loadCartForCurrentUser() {
        const cartKey = this.getCartKey();
        const storedCart = localStorage.getItem(cartKey);
        if (storedCart) {
            this.cartItemsSubject.next(JSON.parse(storedCart));
        } else {
            this.cartItemsSubject.next([]);
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

    clearCartForUser(userId: number) {
        // Clear cart for specific user when they logout
        const cartKey = `cart_user_${userId}`;
        localStorage.removeItem(cartKey);

        // If this is the current user, also clear the subject
        const currentUser = this.authService.currentUserValue;
        if (currentUser && currentUser.id === userId) {
            this.cartItemsSubject.next([]);
        }
    }

    private updateCart(items: CartItem[]) {
        this.cartItemsSubject.next(items);
        const cartKey = this.getCartKey();
        localStorage.setItem(cartKey, JSON.stringify(items));
    }

    get totalAmount(): number {
        return this.cartItemsSubject.value.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }

    get items(): CartItem[] {
        return this.cartItemsSubject.value;
    }
}
