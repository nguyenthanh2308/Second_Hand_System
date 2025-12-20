import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService, Category } from '../../../core/services/category.service';
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
    allProducts: Product[] = [];
    filteredProducts: Product[] = [];
    categories: Category[] = [];
    activeGender: string = 'All';
    filters: any = {
        keyword: '',
        categoryId: null,
        minPrice: null,
        maxPrice: null
    };

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService
    ) { }

    ngOnInit(): void {
        this.loadProducts();
        this.loadCategories();
    }

    loadCategories() {
        this.categoryService.getCategories().subscribe({
            next: (data) => this.categories = data,
            error: (err) => console.error('Failed to load categories', err)
        });
    }

    loadProducts() {
        this.productService.getProducts(this.filters).subscribe({
            next: (data) => {
                this.allProducts = data;
                this.applyGenderFilter();
            },
            error: (err) => console.error('Failed to load products', err)
        });
    }

    setGender(gender: string) {
        this.activeGender = gender;
        this.applyGenderFilter();
    }

    applyGenderFilter() {
        if (this.activeGender === 'All') {
            this.filteredProducts = this.allProducts;
        } else {
            this.filteredProducts = this.allProducts.filter(p => p.gender === this.activeGender);
        }
    }

    applyFilters() {
        this.loadProducts();
    }
}
