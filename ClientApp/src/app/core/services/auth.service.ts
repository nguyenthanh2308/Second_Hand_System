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
        const storedUser = sessionStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    login(loginRequest: LoginRequest): Observable<string> {
        return this.http.post<{ token: string }>('/api/auth/login', loginRequest)
            .pipe(map(response => {
                const token = response.token;
                const user = this.decodeToken(token);
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return token;
            }));
    }

    register(registerRequest: RegisterRequest): Observable<any> {
        return this.http.post('/api/auth/register', registerRequest);
    }

    logout() {
        sessionStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    private decodeToken(token: string): User {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            // JWT claims - check both simple names and .NET full namespace
            return {
                id: parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload['nameid'] || '0'),
                username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload['unique_name'] || '',
                email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload['email'] || '',
                role: payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Customer',
                token: token
            };
        } catch (e) {
            console.error('Error decoding token', e);
            return { id: 0, username: '', email: '', role: 'Customer', token: token };
        }
    }
}
