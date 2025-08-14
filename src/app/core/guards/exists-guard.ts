import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree} from '@angular/router';
import {ThreadService} from '../services/thread.service';
import {Thread} from "../../shared/models";
import {User} from "@angular/fire/auth";
import {AuthService} from "../services/auth.service";

export const existsGuard: CanActivateFn = async (route: ActivatedRouteSnapshot): Promise<true | UrlTree> => {
	const router: Router = inject(Router);
	const authService: AuthService = inject(AuthService);
	const threadService: ThreadService = inject(ThreadService);
	const id: string | null = route.paramMap.get('id');

	if (!id) {
		// No ID at all → safe fallback
		return router.createUrlTree(['/threads']);
	}

	// Determine the top-level segment this guard runs under
	const parentPath: string = route.parent?.routeConfig?.path ?? route.routeConfig?.path ?? '';

	if (parentPath.startsWith('profile')) {
		const user: User | null = await authService.getUser(id);
		if (!user) {
			return router.createUrlTree(['/threads']);
		}
		return true;
	}

	if (parentPath.startsWith('threads')) {
		const thread: Thread | null = await threadService.getThread(id);
		if (!thread) {
			return router.createUrlTree(['/threads']);
		}
		return true;
	}

	// Default fallback for unexpected routing contexts
	return router.createUrlTree(['/threads']);
};
