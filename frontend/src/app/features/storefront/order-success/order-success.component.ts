import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-order-success',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="container text-center py-5">
      <div class="card shadow-sm p-5 mx-auto" style="max-width: 600px;">
        <div class="mb-4 text-success">
          <i class="fas fa-check-circle fa-5x"></i>
        </div>
        <h2 class="mb-3">Order Placed Successfully!</h2>
        <p class="lead mb-4">Thank you for your purchase. Your order ID is <strong>#{{ orderId }}</strong>.</p>
        <a routerLink="/" class="btn btn-primary btn-lg">Return to Home</a>
      </div>
    </div>
  `
})
export class OrderSuccessComponent {
    orderId: string | null = null;

    constructor(private route: ActivatedRoute) {
        this.orderId = this.route.snapshot.queryParamMap.get('id');
    }
}
