import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../../core/services/user.service';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>User Management</h2>
            <a routerLink="/admin/dashboard" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </a>
        </div>

        <div class="card shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="bg-light">
                            <tr>
                                <th scope="col" class="ps-4">ID</th>
                                <th scope="col">Username</th>
                                <th scope="col">Email</th>
                                <th scope="col">Role</th>
                                <th scope="col">Total Orders</th>
                                <th scope="col" class="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let user of users">
                                <td class="ps-4">#{{ user.id }}</td>
                                <td><strong>{{ user.username }}</strong></td>
                                <td>{{ user.email }}</td>
                                <td>
                                    <span class="badge" [ngClass]="{
                                        'bg-danger': user.role === 'Admin',
                                        'bg-primary': user.role === 'Customer'
                                    }">{{ user.role }}</span>
                                </td>
                                <td>{{ user.orderCount }}</td>
                                <td class="text-end pe-4">
                                    <button (click)="toggleRole(user)" 
                                            class="btn btn-sm btn-outline-warning me-2"
                                            [disabled]="user.role === 'Admin' && getAdminCount() <= 1">
                                        <i class="fas fa-exchange-alt"></i> Toggle Role
                                    </button>
                                    <button (click)="deleteUser(user.id)" 
                                            class="btn btn-sm btn-outline-danger"
                                            [disabled]="user.role === 'Admin' && getAdminCount() <= 1">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr *ngIf="users.length === 0">
                                <td colspan="6" class="text-center py-4 text-muted">No users found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `,
    styles: []
})
export class UserListComponent implements OnInit {
    users: User[] = [];

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.userService.getUsers().subscribe({
            next: (data) => this.users = data,
            error: (err) => console.error('Failed to load users', err)
        });
    }

    toggleRole(user: User): void {
        const newRole = user.role === 'Admin' ? 'Customer' : 'Admin';

        if (user.role === 'Admin' && this.getAdminCount() <= 1) {
            alert('Cannot change role of the last admin');
            return;
        }

        if (confirm(`Change ${user.username}'s role to ${newRole}?`)) {
            this.userService.updateUserRole(user.id, newRole).subscribe({
                next: () => {
                    user.role = newRole;
                    alert('Role updated successfully');
                },
                error: (err) => {
                    console.error('Failed to update role', err);
                    alert('Failed to update role');
                }
            });
        }
    }

    deleteUser(userId: number): void {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        if (user.role === 'Admin' && this.getAdminCount() <= 1) {
            alert('Cannot delete the last admin user');
            return;
        }

        if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
            this.userService.deleteUser(userId).subscribe({
                next: () => {
                    this.loadUsers();
                    alert('User deleted successfully');
                },
                error: (err) => {
                    console.error('Failed to delete user', err);
                    alert('Failed to delete user');
                }
            });
        }
    }

    getAdminCount(): number {
        return this.users.filter(u => u.role === 'Admin').length;
    }
}
