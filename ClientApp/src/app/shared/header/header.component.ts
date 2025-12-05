import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
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

    constructor(private authService: AuthService, private cartService: CartService) {
        this.currentUser$ = this.authService.currentUser$;
        this.cartItemCount$ = this.cartService.cartItems$.pipe(
            map(items => items.reduce((acc, item) => acc + item.quantity, 0))
        );
    }

    logout() {
        this.authService.logout();
    }
}
