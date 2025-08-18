import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const selfRedirectGuard: CanActivateFn = async (
	route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
	const authService: AuthService = inject(AuthService);
	const router: Router = inject(Router);

	const myId: string | null = await authService.currentUid();

	if (!myId) return true;

	const url: string = state.url.split('?')[0].split('#')[0];
	
	if (url === `/profile/${myId}`) {
		return router.createUrlTree(['/my-profile']);
	}
	if (url === `/profile/${myId}/threads`) {
		return router.createUrlTree(['/my-profile/threads']);
	}
	if (url === `/profile/${myId}/posts`) {
		return router.createUrlTree(['/my-profile/posts']);
	}

	return true;
};
