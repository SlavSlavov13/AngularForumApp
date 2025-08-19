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
	const uid: string | null = route.paramMap.get('uid');
	const postId: string | null = route.paramMap.get('postId');
	const threadId: string | null = route.paramMap.get('threadId');

	if (uid) {
		if (!(await authService.userExists(uid))) {
			return router.createUrlTree(['/threads']);
		}
		return true;
	}

	if (threadId) {
		if (!(await threadService.threadExists(threadId))) {
			return router.createUrlTree(['/threads']);
		}
		return true;
	}

	if (postId) {
		if (!(await postService.postExists(postId))) {
			return router.createUrlTree(['/threads']);
		}
		return true;
	}

	return router.createUrlTree(['/threads']);
};
