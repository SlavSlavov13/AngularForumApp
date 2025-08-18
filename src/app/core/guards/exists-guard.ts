import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree} from '@angular/router';
import {ThreadService} from '../services/thread.service';
import {AuthService} from "../services/auth.service";
import {PostService} from "../services/post.service";

export const existsGuard: CanActivateFn = async (route: ActivatedRouteSnapshot): Promise<true | UrlTree> => {
	const router: Router = inject(Router);
	const authService: AuthService = inject(AuthService);
	const threadService: ThreadService = inject(ThreadService);
	const postService: PostService = inject(PostService);
	const id: string | null = route.paramMap.get('id');

	if (!id) {
		return router.createUrlTree(['/threads']);
	}

	const parentPath: string = route.parent?.routeConfig?.path ?? route.routeConfig?.path ?? '';

	if (parentPath.startsWith('profile')) {
		if (!(await authService.userExists(id))) {
			return router.createUrlTree(['/threads']);
		}
		return true;
	}

	if (parentPath.startsWith('threads')) {
		if (!(await threadService.threadExists(id))) {
			return router.createUrlTree(['/threads']);
		}
		return true;
	}

	if (parentPath.startsWith('posts')) {
		if (!(await postService.postExists(id))) {
			return router.createUrlTree(['/threads']);
		}
		return true;
	}

	return router.createUrlTree(['/threads']);
};
