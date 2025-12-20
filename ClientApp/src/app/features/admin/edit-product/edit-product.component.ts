import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../models/product.models';

@Component({
    selector: 'app-edit-product',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Edit Product</h2>
            <a routerLink="/admin/products" class="btn btn-secondary">Back to List</a>
        </div>

        <div class="card shadow-sm">
            <div class="card-body">
                <form [formGroup]="editForm" (ngSubmit)="onSubmit()">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Product Name</label>
                            <input type="text" class="form-control" formControlName="name" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Price (VND)</label>
                            <input type="number" class="form-control" formControlName="price" required>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Original Price (VND)</label>
                            <input type="number" class="form-control" formControlName="originalPrice">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Condition (%)</label>
                            <input type="text" class="form-control" formControlName="condition">
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Category ID</label>
                            <input type="number" class="form-control" formControlName="categoryId" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Status</label>
                            <select class="form-select" formControlName="status">
                                <option value="Available">Available</option>
                                <option value="Sold">Sold</option>
                                <option value="Hidden">Hidden</option>
                            </select>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Gender</label>
                            <select class="form-select" formControlName="gender">
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Unisex">Unisex</option>
                            </select>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" rows="4" formControlName="description"></textarea>
                    </div>

                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary" [disabled]="!editForm.valid || isSubmitting">
                            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                        </button>
                        <a routerLink="/admin/products" class="btn btn-secondary">Cancel</a>
                    </div>

                    <div *ngIf="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
                    <div *ngIf="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
                </form>
            </div>
        </div>
    </div>
    `,
    styles: []
})
export class EditProductComponent implements OnInit {
    editForm: FormGroup;
    productId!: number;
    isSubmitting = false;
    errorMessage = '';
    successMessage = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private productService: ProductService
    ) {
        this.editForm = this.fb.group({
            name: ['', Validators.required],
            price: [0, [Validators.required, Validators.min(0)]],
            originalPrice: [0],
            condition: [''],
            description: [''],
            categoryId: [1, Validators.required],
            status: ['Available'],
            gender: ['Unisex'],
            imageUrl: ['']
        });
    }

    ngOnInit(): void {
        this.productId = Number(this.route.snapshot.paramMap.get('id'));
        if (this.productId) {
            this.loadProduct();
        }
    }

    loadProduct(): void {
        this.productService.getProduct(this.productId).subscribe({
            next: (product) => {
                this.editForm.patchValue({
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    condition: product.condition,
                    description: product.description,
                    categoryId: product.categoryId,
                    status: product.status,
                    imageUrl: product.imageUrl
                });
            },
            error: () => {
                this.errorMessage = 'Failed to load product';
            }
        });
    }

    onSubmit(): void {
        if (this.editForm.valid && !this.isSubmitting) {
            this.isSubmitting = true;
            this.errorMessage = '';
            this.successMessage = '';

            const product: Product = {
                id: this.productId,
                ...this.editForm.value
            };

            this.productService.updateProduct(this.productId, product).subscribe({
                next: () => {
                    this.successMessage = 'Product updated successfully!';
                    setTimeout(() => {
                        this.router.navigate(['/admin/products']);
                    }, 1500);
                },
                error: () => {
                    this.errorMessage = 'Failed to update product';
                    this.isSubmitting = false;
                }
            });
        }
    }
}
