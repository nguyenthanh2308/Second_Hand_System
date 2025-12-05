import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../models/product.models';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    products$: Observable<Product[]> | undefined;

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        // Fetch latest products (e.g., first page, or specific 'latest' endpoint if available)
        // For now, just fetching all and taking first few in template or service
        this.products$ = this.productService.getProducts({});
    }
}
