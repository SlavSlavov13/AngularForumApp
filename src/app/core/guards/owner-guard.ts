import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {ThreadService} from '../services/thread.service';
import {ThreadModel} from "../../shared/models";

export const ownerGuard: CanActivateFn = async (route: ActivatedRouteSnapshot): Promise<true | UrlTree> => {
	const auth: AuthService = inject(AuthService);
	const threadService: ThreadService = inject(ThreadService);
	const router: Router = inject(Router);

	const id: string | null = route.paramMap.get('id');
	if (!id) return router.createUrlTree(['/threads']);

	const thread: ThreadModel | null = await threadService.getThread(id);
	return thread?.authorId === await auth.currentUid()
		? true
		: router.createUrlTree([`/threads/${id}`]);
};
