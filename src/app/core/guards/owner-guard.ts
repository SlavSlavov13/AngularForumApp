import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {ThreadService} from '../services/thread.service';
import {ThreadModel} from "../../shared/models";
import {firstValueFrom} from "rxjs";

export const ownerGuard: CanActivateFn = async (route: ActivatedRouteSnapshot): Promise<true | UrlTree> => {
	const authService: AuthService = inject(AuthService);
	const threadService: ThreadService = inject(ThreadService);
	const router: Router = inject(Router);

	const id: string | null = route.paramMap.get('id');
	if (!id) return router.createUrlTree(['/threads']);

	const thread: ThreadModel | null = await firstValueFrom(threadService.getThread(id));
	return thread?.authorId === await authService.currentUid()
		? true
		: router.createUrlTree([`/threads/${id}`]);
};
