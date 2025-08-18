import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const selfRedirectGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> => {
	const authService: AuthService = inject(AuthService);
	const router: Router = inject(Router);

	const profileId: string | null = route.paramMap.get('id');
	const myId: string | null = await authService.currentUid();

	const parentPath: string = route.parent?.routeConfig?.path ?? route.routeConfig?.path ?? '';

	if (parentPath.startsWith('profile')) {
		if (myId && profileId === myId) {
			return router.createUrlTree(['/my-profile']);
		}
		return true;
	} else if (parentPath.startsWith('threads')) {
		if (myId && profileId === myId) {
			return router.createUrlTree(['/my-profile/threads']);
		}
		return true;
	} else {
		if (myId && profileId === myId) {
			return router.createUrlTree(['/my-profile/posts']);
		}
		return true;
	}
};
