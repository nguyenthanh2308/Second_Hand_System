import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
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
        private productService: ProductService,
        private cartService: CartService
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.product$ = this.productService.getProduct(id);
        }
    }

    addToCart(product: Product) {
        this.cartService.addToCart(product);
    }
}
