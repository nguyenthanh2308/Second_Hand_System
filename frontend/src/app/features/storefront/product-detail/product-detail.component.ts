import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../models/product.models';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
    product$: Observable<Product> | undefined;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService,
        private cartService: CartService,
        private authService: AuthService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.product$ = this.productService.getProduct(id);
        }
    }

    addToCart(product: Product) {
        // Check if user is logged in
        if (!this.authService.isLoggedIn()) {
            this.toastService.warning('Please login to add products to cart');
            // Redirect to login after 1.5 seconds
            setTimeout(() => {
                this.router.navigate(['/login'], {
                    queryParams: { returnUrl: this.router.url }
                });
            }, 1500);
            return;
        }

        // User is logged in, proceed with adding to cart
        this.cartService.addToCart(product);
        // Toast is shown by CartService
    }
}
