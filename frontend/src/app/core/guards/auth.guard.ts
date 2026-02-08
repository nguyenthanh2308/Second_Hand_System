import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const currentUser = authService.currentUserValue;

    if (currentUser) {
        // check if route is restricted by role
        if (route.data['roles'] && route.data['roles'].indexOf(currentUser.role) === -1) {
            // role not authorised so redirect to home page
            router.navigate(['/']);
            return false;
        }

        // authorised so return true
        return true;
    }

    // not logged in so redirect to login page with the return url
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
};
