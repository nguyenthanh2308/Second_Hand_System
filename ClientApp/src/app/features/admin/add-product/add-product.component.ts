import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
    selector: 'app-add-product',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
    product = {
        name: '',
        price: 0,
        originalPrice: 0,
        condition: '',
        description: '',
        categoryId: 1,
        gender: 'Unisex'
    };
    selectedFile: File | null = null;
    isSubmitting = false;
    categories: any[] = [];

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (data) => {
                this.categories = data;
                if (this.categories.length > 0) {
                    this.product.categoryId = this.categories[0].id;
                }
            },
            error: (err) => console.error('Failed to load categories', err)
        });
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    onSubmit() {
        if (!this.selectedFile) {
            alert('Please select an image.');
            return;
        }

        this.isSubmitting = true;
        const formData = new FormData();
        formData.append('Name', this.product.name);
        formData.append('Price', this.product.price.toString());
        formData.append('OriginalPrice', this.product.originalPrice.toString());
        formData.append('Condition', this.product.condition);
        formData.append('Description', this.product.description);
        formData.append('CategoryId', this.product.categoryId.toString());
        formData.append('ImageFile', this.selectedFile);

        this.productService.createProduct(formData).subscribe({
            next: () => {
                this.isSubmitting = false;
                alert('Product created successfully!');
                this.router.navigate(['/catalog']);
            },
            error: (err) => {
                this.isSubmitting = false;
                console.error(err);
                alert('Failed to create product.');
            }
        });
    }
}
