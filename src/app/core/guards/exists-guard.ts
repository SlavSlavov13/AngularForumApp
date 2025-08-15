import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree} from '@angular/router';
import {ThreadService} from '../services/thread.service';
import {AppUserModel, ThreadModel} from "../../shared/models";
import {AuthService} from "../services/auth.service";

export const existsGuard: CanActivateFn = async (route: ActivatedRouteSnapshot): Promise<true | UrlTree> => {
	const router: Router = inject(Router);
	const authService: AuthService = inject(AuthService);
	const threadService: ThreadService = inject(ThreadService);
	const id: string | null = route.paramMap.get('id');

	if (!id) {
		return router.createUrlTree(['/threads']);
	}

	const parentPath: string = route.parent?.routeConfig?.path ?? route.routeConfig?.path ?? '';

	if (parentPath.startsWith('profile')) {
		const user: AppUserModel | null = await authService.getUser(id);
		if (!user) {
			return router.createUrlTree(['/threads']);
		}
		return true;
	}

	if (parentPath.startsWith('threads')) {
		const thread: ThreadModel | null = await threadService.getThread(id);
		if (!thread) {
			return router.createUrlTree(['/threads']);
		}
		return true;
	}

	return router.createUrlTree(['/threads']);
};
