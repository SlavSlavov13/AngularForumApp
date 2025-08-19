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

	const postId: string | null = route.paramMap.get('postId');
	const threadId: string | null = route.paramMap.get('threadId');

	if (threadId) {
		const thread: ThreadModel = await firstValueFrom(threadService.getThread(threadId));
		return thread.authorId === await authService.currentUid()
			? true
			: router.createUrlTree([`/threads/${threadId}`]);
	}

	if (postId) {
		const post: PostModel = await firstValueFrom(postService.getPost(postId));
		return post.authorId === await authService.currentUid()
			? true
			: router.createUrlTree([`/threads/${post.threadId}`]);
	}

	return router.createUrlTree([`/threads`]);
};
