import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {ThreadService} from '../services/thread.service';
import {Thread} from "../../shared/models";

export const ownerGuard: CanActivateFn = async (route: ActivatedRouteSnapshot): Promise<boolean> => {
	const auth: AuthService = inject(AuthService);
	const router: Router = inject(Router);
	const threadService: ThreadService = inject(ThreadService);

	const id: string | null = route.paramMap.get('id');
	if (!id) return false;

	const thread: Thread | null = await threadService.getThread(id);
	if (thread?.authorId !== auth.currentUid()) {
		router.navigateByUrl(`/threads/${id}`);
		return false;
	}
	return true;
};
