import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../models/product.models';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-admin-product-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class AdminProductListComponent implements OnInit {
    products$: Observable<Product[]> | undefined;

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts() {
        this.products$ = this.productService.getProducts({});
    }

    deleteProduct(id: number) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.productService.deleteProduct(id).subscribe(() => {
                this.loadProducts();
            });
        }
    }
}
