import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {firstValueFrom, Observable} from 'rxjs';
import {AppUserModel, ThreadModel} from '../../../shared/models';
import {ThreadService} from '../../../core/services/thread.service';
import {AuthService} from "../../../core/services/auth.service";
import {AsyncPipe} from "@angular/common";
import {handleError} from "../../../shared/helpers";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";
import {Store} from "@ngrx/store";
import {ThreadPostsList} from "../../posts/thread-posts-list/thread-posts-list";

@Component({
	selector: 'app-thread-details',
	standalone: true,
	imports: [RouterLink, AsyncPipe, ThreadPostsList],
	templateUrl: './thread-details.html',
	styleUrl: './thread-details.css'
})
export class ThreadDetails implements OnInit {
	error: string | null = null;
	thread!: ThreadModel;
	author!: AppUserModel;
	tags: string = '';
	currentUid: Promise<string | null> = this.authService.currentUid();
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	deleting: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private threadService: ThreadService,
		private authService: AuthService,
		private store: Store<AppState>,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			const threadId: string = this.route.snapshot.paramMap.get('threadId')!;
			this.thread = await firstValueFrom(this.threadService.getThread(threadId));
			this.tags = this.thread.tags.join(', ')
			const authorUid: string = this.thread.authorId;
			this.author = await this.authService.getUser(authorUid);
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.store.dispatch(hideLoading());
		}
	}

	async delete(): Promise<void> {
		try {
			this.deleting = true;
			const ok: boolean = confirm(`Delete thread "${this.thread.title}"? This cannot be undone.`);
			if (!ok) return;

			await firstValueFrom(this.threadService.deleteThread(this.thread.id));
			await this.router.navigate(['/threads']);
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.deleting = false
		}

	}
}
