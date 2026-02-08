import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    template: `
    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 SecondHand System. All rights reserved.</p>
      </div>
    </footer>
  `,
    styles: [`
    .footer {
      background-color: #f8f9fa;
      padding: 1rem 0;
      margin-top: auto;
      border-top: 1px solid #e9ecef;
      text-align: center;
      color: #6c757d;
    }
  `]
})
export class FooterComponent { }
