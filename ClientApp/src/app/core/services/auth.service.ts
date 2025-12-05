import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { LoginRequest, RegisterRequest, User } from '../../models/auth.models';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser$: Observable<User | null>;

    constructor(private http: HttpClient, private router: Router) {
        const storedUser = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    login(loginRequest: LoginRequest): Observable<string> {
        return this.http.post<string>('/api/auth/login', loginRequest, { responseType: 'text' as 'json' })
            .pipe(map(token => {
                // Decode token to get user info (simplified for now, ideally use jwt-decode)
                // For this demo, we'll fetch user profile or just mock the user object based on token claims if possible.
                // Since backend only returns token string, we need to handle it.
                // Let's assume we can decode it or we just store the token and role.
                // Ideally backend should return User object + Token.
                // But based on current BE, it returns just string.
                // We will decode the token manually to get claims.

                const user = this.decodeToken(token);
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return token;
            }));
    }

    register(registerRequest: RegisterRequest): Observable<any> {
        return this.http.post('/api/auth/register', registerRequest);
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    private decodeToken(token: string): User {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                id: parseInt(payload.nameid),
                username: payload.unique_name,
                email: payload.email,
                role: payload.role,
                token: token
            };
        } catch (e) {
            console.error('Error decoding token', e);
            return { id: 0, username: '', email: '', role: 'Customer', token: token };
        }
    }
}
