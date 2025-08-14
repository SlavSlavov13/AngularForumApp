import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const selfThreadRedirectGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
	const auth: AuthService = inject(AuthService);
	const router: Router = inject(Router);

	// Get :id from the route
	const profileId: string | null = route.paramMap.get('id');
	// Get the currently logged-in user's ID
	const myId: string | null = auth.currentUid();

	// If the profile belongs to the currently logged-in user → redirect
	if (myId && profileId === myId) {
		return router.createUrlTree(['/my-profile/threads']);
	}

	// Otherwise allow access
	return true;
};
