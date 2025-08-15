import {inject} from '@angular/core';
import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const guestGuard: CanActivateFn = async (): Promise<true | UrlTree> => {
	const auth: AuthService = inject(AuthService);
	const router: Router = inject(Router);

	const loggedIn: boolean = await auth.isLoggedIn();
	return loggedIn ? router.createUrlTree(['/threads']) : true;
};
