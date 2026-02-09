import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Category {
    id: number;
    name: string;
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private http: HttpClient) { }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${environment.apiUrl}/api/category`);
    }

    getCategory(id: number): Observable<Category> {
        return this.http.get<Category>(`/api/category/${id}`);
    }

    createCategory(category: Category): Observable<Category> {
        return this.http.post<Category>(`${environment.apiUrl}/api/category`, category);
    }

    updateCategory(id: number, category: Category): Observable<void> {
        return this.http.put<void>(`/api/category/${id}`, category);
    }

    deleteCategory(id: number): Observable<void> {
        return this.http.delete<void>(`/api/category/${id}`);
    }
}
