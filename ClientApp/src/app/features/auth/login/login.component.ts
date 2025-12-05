import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    username = '';
    password = '';
    error = '';
    returnUrl: string;

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    onSubmit() {
        this.authService.login({ username: this.username, password: this.password })
            .subscribe({
                next: () => {
                    this.router.navigate([this.returnUrl]);
                },
                error: (err) => {
                    this.error = 'Invalid username or password';
                    console.error(err);
                }
            });
    }
}
