import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const selfProfileRedirectGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
	const auth: AuthService = inject(AuthService);
	const router: Router = inject(Router);

	// Extract the `id` from the route params
	const profileId: string | null = route.paramMap.get('id');
	const myId: string | null = auth.currentUid();

	// If logged in and the id matches the logged-in user's id → redirect to /my-profile
	if (myId && profileId === myId) {
		return router.createUrlTree(['/my-profile']);
	}

	// If it's not the same user, allow navigation
	return true;
};
