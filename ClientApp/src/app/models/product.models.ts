export interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    condition?: string; // 'New', 'Like New', 'Good', 'Fair'
    description?: string;
    imageUrl?: string;
    status: 'Available' | 'Sold' | 'Hidden';
    createdDate: Date;
    categoryId: number;
    categoryName?: string;
}

export interface ProductFilter {
    keyword?: string;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: number;
    condition?: string;
}
