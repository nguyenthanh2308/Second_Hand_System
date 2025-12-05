import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../models/product.models';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-catalog',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
    products$: Observable<Product[]> | undefined;
    filters: any = {
        keyword: '',
        categoryId: null,
        minPrice: null,
        maxPrice: null
    };

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts() {
        this.products$ = this.productService.getProducts(this.filters);
    }

    applyFilters() {
        this.loadProducts();
    }
}
