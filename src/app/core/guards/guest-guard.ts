import {inject} from '@angular/core';
import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const guestGuard: CanActivateFn = (): true | UrlTree => {
	const auth: AuthService = inject(AuthService);
	const router: Router = inject(Router);

	// If logged in, redirect to a sensible default (e.g., threads)
	return !auth.isLoggedIn() ? true : router.createUrlTree(['/threads']);
};
