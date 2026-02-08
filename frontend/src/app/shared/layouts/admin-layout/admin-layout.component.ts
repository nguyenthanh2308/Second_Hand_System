import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-wrapper">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/admin/products" routerLinkActive="active">Manage Products</a>
          <a routerLink="/admin/categories" routerLinkActive="active">Manage Categories</a>
          <a routerLink="/admin/orders" routerLinkActive="active">Manage Orders</a>
          <a routerLink="/admin/users" routerLinkActive="active">Manage Users</a>
          <a routerLink="/" class="back-home">Back to Store</a>
          <button (click)="logout()" class="btn-logout">Logout</button>
        </nav>
      </aside>
      <main class="admin-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-wrapper {
      display: flex;
      min-height: 100vh;
    }
    .sidebar {
      width: 250px;
      background: #343a40;
      color: white;
      display: flex;
      flex-direction: column;
    }
    .sidebar-header {
      padding: 1.5rem;
      background: #212529;
    }
    .sidebar-header h3 {
      margin: 0;
      font-size: 1.25rem;
      color: #f8f9fa;
      font-weight: 600;
    }
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      padding: 1rem 0;
    }
    .sidebar-nav a {
      padding: 1rem 1.5rem;
      color: #adb5bd;
      text-decoration: none;
      transition: all 0.3s;
    }
    .sidebar-nav a:hover, .sidebar-nav a.active {
      color: white;
      background: #495057;
    }
    .back-home {
      margin-top: auto;
      border-top: 1px solid #495057;
    }
    .btn-logout {
      background: none;
      border: none;
      color: #dc3545;
      padding: 1rem 1.5rem;
      text-align: left;
      cursor: pointer;
      font-size: 1rem;
    }
    .btn-logout:hover {
      background: #495057;
    }
    .admin-content {
      flex: 1;
      padding: 2rem;
      background: #f4f6f8;
    }
  `]
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}
