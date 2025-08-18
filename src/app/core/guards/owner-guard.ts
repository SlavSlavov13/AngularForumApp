import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {ThreadService} from '../services/thread.service';
import {PostModel, ThreadModel} from "../../shared/models";
import {firstValueFrom} from "rxjs";
import {PostService} from "../services/post.service";

export const ownerGuard: CanActivateFn = async (route: ActivatedRouteSnapshot): Promise<true | UrlTree> => {
	const authService: AuthService = inject(AuthService);
	const threadService: ThreadService = inject(ThreadService);
	const postService: PostService = inject(PostService);
	const router: Router = inject(Router);

	const id: string | null = route.paramMap.get('id');
	if (!id) return router.createUrlTree(['/threads']);

	const parentPath: string = route.parent?.routeConfig?.path ?? route.routeConfig?.path ?? '';

	if (parentPath.startsWith('threads')) {
		const thread: ThreadModel | null = await firstValueFrom(threadService.getThread(id));
		return thread?.authorId === await authService.currentUid()
			? true
			: router.createUrlTree([`/threads/${id}`]);
	}

	if (parentPath.startsWith('posts')) {
		const post: PostModel | null = await firstValueFrom(postService.getPost(id));
		return post?.authorId === await authService.currentUid()
			? true
			: router.createUrlTree([`/threads/${post.threadId}`]);
	}

	return router.createUrlTree([`/threads`]);
};
