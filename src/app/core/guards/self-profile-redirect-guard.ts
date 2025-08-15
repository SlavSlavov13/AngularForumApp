import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const selfProfileRedirectGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> => {
	const auth: AuthService = inject(AuthService);
	const router: Router = inject(Router);

	const profileId: string | null = route.paramMap.get('id');
	const myId: string | null = await auth.currentUid();

	if (myId && profileId === myId) {
		return router.createUrlTree(['/my-profile']);
	}

	return true;
};
