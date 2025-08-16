import {inject} from '@angular/core';
import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const guestGuard: CanActivateFn = async (): Promise<true | UrlTree> => {
	const authService: AuthService = inject(AuthService);
	const router: Router = inject(Router);

	const loggedIn: boolean = await authService.isLoggedIn();
	return loggedIn ? router.createUrlTree(['/threads']) : true;
};
