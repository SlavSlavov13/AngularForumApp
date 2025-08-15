import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<true | UrlTree> => {
	const auth: AuthService = inject(AuthService);
	const router: Router = inject(Router);

	if (await auth.isLoggedIn()) return true;

	return router.createUrlTree(
		['/login'],
		{queryParams: {returnUrl: state.url}}
	);
};
