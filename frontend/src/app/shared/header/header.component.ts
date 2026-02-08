import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { Observable, map } from 'rxjs';
import { User } from '../../models/auth.models';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    currentUser$: Observable<User | null>;
    cartItemCount$: Observable<number>;

    constructor(
        private authService: AuthService,
        private cartService: CartService,
        private location: Location,
        private router: Router
    ) {
        this.currentUser$ = this.authService.currentUser$;
        this.cartItemCount$ = this.cartService.cartItems$.pipe(
            map(items => items.reduce((acc, item) => acc + item.quantity, 0))
        );
    }

    shouldShowBackButton(): boolean {
        const currentUrl = this.router.url;
        return currentUrl !== '/' &&
            !currentUrl.includes('/login') &&
            !currentUrl.includes('/register');
    }

    goBack() {
        this.location.back();
    }

    logout() {
        this.authService.logout();
    }
}
