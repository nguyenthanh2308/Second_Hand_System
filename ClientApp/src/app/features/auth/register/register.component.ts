import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    user = {
        username: '',
        password: '',
        email: '',
        address: ''
    };
    error = '';
    success = '';

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit() {
        this.authService.register(this.user).subscribe({
            next: () => {
                this.success = 'Registration successful! Redirecting to login...';
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 2000);
            },
            error: (err) => {
                this.error = 'Registration failed. Username or Email might already be taken.';
                console.error(err);
            }
        });
    }
}
