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
                            <select class="form-select" formControlName="condition">
                                <option value="">Select Condition</option>
                                <option value="100%">100% - New</option>
                                <option value="95%">95% - Like New</option>
                                <option value="90%">90% - Excellent</option>
                                <option value="85%">85% - Very Good</option>
                                <option value="80%">80% - Good</option>
                                <option value="75%">75%</option>
                                <option value="70%">70%</option>
                                <option value="65%">65%</option>
                                <option value="60%">60%</option>
                                <option value="50%">50% - Fair</option>
                            </select>
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

                    <div class="row">
                        <div class="col-md-12 mb-3">
                            <label class="form-label">Size (Optional)</label>
                            <select class="form-select" formControlName="size">
                                <option value="">-- Select Size --</option>
                                <optgroup label="Quần áo">
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                    <option value="XXXL">XXXL</option>
                                </optgroup>
                                <optgroup label="Giày dép">
                                    <option value="35">35</option>
                                    <option value="36">36</option>
                                    <option value="37">37</option>
                                    <option value="38">38</option>
                                    <option value="39">39</option>
                                    <option value="40">40</option>
                                    <option value="41">41</option>
                                    <option value="42">42</option>
                                    <option value="43">43</option>
                                    <option value="44">44</option>
                                    <option value="45">45</option>
                                </optgroup>
                                <option value="Free Size">Free Size</option>
                                <option value="One Size">One Size</option>
                            </select>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" rows="4" formControlName="description"></textarea>
                    </div>

                    <!-- Image Upload Section -->
                    <div class="mb-3">
                        <label class="form-label">Product Image</label>
                        <div class="row">
                            <div class="col-md-6">
                                <div *ngIf="currentImageUrl" class="mb-2">
                                    <label class="d-block text-muted small">Current Image:</label>
                                    <img [src]="currentImageUrl" alt="Current product" class="img-thumbnail" style="max-width: 300px; max-height: 300px;">
                                </div>
                                <div *ngIf="previewImageUrl && previewImageUrl !== currentImageUrl" class="mb-2">
                                    <label class="d-block text-success small">New Image Preview:</label>
                                    <img [src]="previewImageUrl" alt="New product" class="img-thumbnail" style="max-width: 300px; max-height: 300px;">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input type="file" class="form-control" (change)="onFileSelected($event)" accept="image/*">
                                <small class="text-muted">Leave empty to keep current image</small>
                            </div>
                        </div>
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
    selectedFile: File | null = null;
    currentImageUrl: string = '';
    previewImageUrl: string = '';

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
            size: [''],
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
                    gender: product.gender,
                    size: product.size,
                    imageUrl: product.imageUrl
                });
                this.currentImageUrl = product.imageUrl || '';
                this.previewImageUrl = product.imageUrl || '';
            },
            error: () => {
                this.errorMessage = 'Failed to load product';
            }
        });
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            // Create preview
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.previewImageUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    onSubmit(): void {
        if (this.editForm.valid && !this.isSubmitting) {
            this.isSubmitting = true;
            this.errorMessage = '';
            this.successMessage = '';

            // Always use FormData since backend expects [FromForm]
            const formData = new FormData();
            formData.append('Id', this.productId.toString());
            formData.append('Name', this.editForm.value.name);
            formData.append('Price', this.editForm.value.price.toString());
            formData.append('OriginalPrice', this.editForm.value.originalPrice?.toString() || '0');
            formData.append('Condition', this.editForm.value.condition || '');
            formData.append('Description', this.editForm.value.description || '');
            formData.append('CategoryId', this.editForm.value.categoryId.toString());
            formData.append('Status', this.editForm.value.status);
            formData.append('Gender', this.editForm.value.gender);
            formData.append('Size', this.editForm.value.size || '');

            // Append image file if selected
            if (this.selectedFile) {
                formData.append('ImageFile', this.selectedFile);
            }

            this.productService.updateProductWithImage(this.productId, formData).subscribe({
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
