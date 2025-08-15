import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {filter, map, shareReplay, switchMap} from 'rxjs/operators';
import {from, Observable} from 'rxjs';
import {ThreadModel} from '../../../shared/models';
import {ThreadService} from '../../../core/services/thread.service';
import {AsyncPipe} from '@angular/common';
import {AuthService} from "../../../core/services/auth.service";

@Component({
	selector: 'app-thread-details',
	standalone: true,
	imports: [AsyncPipe, RouterLink],
	templateUrl: './thread-details.html',
	styleUrl: './thread-details.css'
})
export class ThreadDetails {
	private route: ActivatedRoute = inject(ActivatedRoute);
	private router: Router = inject(Router);
	private threadService: ThreadService = inject(ThreadService);
	private authService: AuthService = inject(AuthService);
	protected currentUid: Promise<string | null> = this.authService.currentUid();

	thread$: Observable<ThreadModel> = this.route.paramMap.pipe(
		map(params => params.get('id')!),
		switchMap(id => from(this.threadService.getThread(id))),
		filter((t): t is ThreadModel => t !== null),
		shareReplay({bufferSize: 1, refCount: true})
	);

	async delete(thread: ThreadModel): Promise<void> {
		const ok: boolean = confirm(`Delete thread "${thread.title}"? This cannot be undone.`);
		if (!ok) return;

		try {
			await this.threadService.deleteThread(thread.id);
			await this.router.navigate(['/threads']);
		} catch (e) {
			console.error('Failed to delete thread', e);
			alert('Failed to delete thread. Please try again.');
		}
	}

}
