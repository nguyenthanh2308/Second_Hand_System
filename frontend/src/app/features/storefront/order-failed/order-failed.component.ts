import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-order-failed',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="container text-center py-5">
      <div class="card shadow-sm p-5 mx-auto border-danger" style="max-width: 600px;">
        <div class="mb-4 text-danger">
          <i class="fas fa-exclamation-circle fa-5x"></i>
        </div>
        <h2 class="mb-3 text-danger">Order Failed</h2>
        <p class="lead mb-4 fw-bold">Rất tiếc, sản phẩm trong giỏ hàng của bạn vừa có người khác mua mất rồi!</p>
        <p class="text-muted mb-4">Please check the catalog for other available items.</p>
        <a routerLink="/catalog" class="btn btn-outline-primary btn-lg">Back to Catalog</a>
      </div>
    </div>
  `
})
export class OrderFailedComponent { }
