import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const selfThreadRedirectGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> => {
	const authService: AuthService = inject(AuthService);
	const router: Router = inject(Router);

	const profileId: string | null = route.paramMap.get('id');
	const myId: string | null = await authService.currentUid();

	if (myId && profileId === myId) {
		return router.createUrlTree(['/my-profile/threads']);
	}

	return true;
};
