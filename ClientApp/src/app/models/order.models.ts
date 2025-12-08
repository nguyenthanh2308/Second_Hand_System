export interface Order {
    id: number;
    userId: number;
    orderDate: Date;
    totalAmount: number;
    status: 'Pending' | 'Shipping' | 'Completed' | 'Cancelled';
    shippingAddress: string;
    orderDetails: OrderDetail[];
}

export interface OrderDetail {
    id: number;
    orderId: number;
    productId: number;
    productName?: string;
    productImage?: string;
    price: number;
    product?: {
        id: number;
        name: string;
        imageUrl: string;
        condition: string;
        price: number;
    };
}

export interface CreateOrderRequest {
    userId: number;
    productIds: number[];
    shippingAddress: string;
}
