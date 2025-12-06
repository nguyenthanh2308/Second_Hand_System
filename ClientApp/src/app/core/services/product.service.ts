import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductFilter } from '../../models/product.models';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private http: HttpClient) { }

    getProducts(filter: ProductFilter): Observable<Product[]> {
        let params = new HttpParams();
        if (filter.keyword) params = params.set('keyword', filter.keyword);
        if (filter.minPrice) params = params.set('minPrice', filter.minPrice);
        if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice);
        if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
        if (filter.condition) params = params.set('condition', filter.condition);

        return this.http.get<Product[]>('/api/product', { params });
    }

    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`/api/product/${id}`);
    }

    createProduct(productData: FormData): Observable<Product> {
        return this.http.post<Product>('/api/product', productData);
    }

    updateProduct(id: number, product: Product): Observable<void> {
        return this.http.put<void>(`/api/product/${id}`, product);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`/api/product/${id}`);
    }
}
