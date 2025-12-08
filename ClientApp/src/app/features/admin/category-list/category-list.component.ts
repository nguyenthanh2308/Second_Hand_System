import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../core/services/category.service';

@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    template: `
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Manage Categories</h2>
            <button class="btn btn-primary" (click)="showAddModal = true">
                <i class="fas fa-plus"></i> Add Category
            </button>
        </div>

        <div class="card shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="bg-light">
                            <tr>
                                <th scope="col" class="ps-4">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Description</th>
                                <th scope="col" class="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let category of categories">
                                <td class="ps-4">#{{ category.id }}</td>
                                <td><strong>{{ category.name }}</strong></td>
                                <td>{{ category.description || '-' }}</td>
                                <td class="text-end pe-4">
                                    <button (click)="editCategory(category)" class="btn btn-sm btn-outline-primary me-2">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button (click)="deleteCategory(category.id)" class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr *ngIf="categories.length === 0">
                                <td colspan="4" class="text-center py-4 text-muted">No categories found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade show" [class.d-block]="showAddModal || showEditModal" [style.background]="'rgba(0,0,0,0.5)'" *ngIf="showAddModal || showEditModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ showEditModal ? 'Edit Category' : 'Add Category' }}</h5>
                    <button type="button" class="btn-close" (click)="closeModal()"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Category Name</label>
                        <input type="text" class="form-control" [(ngModel)]="currentCategory.name" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" rows="3" [(ngModel)]="currentCategory.description"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
                    <button type="button" class="btn btn-primary" (click)="saveCategory()" [disabled]="!currentCategory.name">
                        {{ showEditModal ? 'Update' : 'Create' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
    `,
    styles: [`
        .modal.d-block { 
            display: flex !important; 
            align-items: center; 
            justify-content: center;
        }
        .modal-dialog {
            width: 100%; /* Ensure proper width handling in flex container */
            max-width: 500px;
        }
    `]
})
export class CategoryListComponent implements OnInit {
    categories: Category[] = [];
    showAddModal = false;
    showEditModal = false;
    currentCategory: Category = { id: 0, name: '', description: '' };

    constructor(private categoryService: CategoryService) { }

    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (data) => this.categories = data,
            error: (err) => console.error('Failed to load categories', err)
        });
    }

    editCategory(category: Category): void {
        this.currentCategory = { ...category };
        this.showEditModal = true;
    }

    saveCategory(): void {
        if (this.showEditModal) {
            this.categoryService.updateCategory(this.currentCategory.id, this.currentCategory).subscribe({
                next: () => {
                    this.loadCategories();
                    this.closeModal();
                },
                error: (err) => console.error('Failed to update category', err)
            });
        } else {
            this.categoryService.createCategory(this.currentCategory).subscribe({
                next: () => {
                    this.loadCategories();
                    this.closeModal();
                },
                error: (err) => console.error('Failed to create category', err)
            });
        }
    }

    deleteCategory(id: number): void {
        if (confirm('Are you sure you want to delete this category?')) {
            this.categoryService.deleteCategory(id).subscribe({
                next: () => this.loadCategories(),
                error: (err) => console.error('Failed to delete category', err)
            });
        }
    }

    closeModal(): void {
        this.showAddModal = false;
        this.showEditModal = false;
        this.currentCategory = { id: 0, name: '', description: '' };
    }
}
