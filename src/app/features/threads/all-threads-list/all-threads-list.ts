import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppUserModel, ThreadModel} from "../../../shared/models";
import {Observable} from "rxjs";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";
import {ThreadService} from "../../../core/services/thread.service";
import {Store} from "@ngrx/store";
import {handleError} from "../../../shared/helpers";
import {ThreadsVisualization} from "../threads-visualization/threads-visualization";
import {AsyncPipe} from "@angular/common";
import {AuthService} from "../../../core/services/auth.service";

@Component({
	selector: 'app-all-threads-list',
	imports: [
		ThreadsVisualization,
		AsyncPipe
	],
	templateUrl: './all-threads-list.html',
	styleUrl: './all-threads-list.css'
})
export class AllThreadsList implements OnInit, OnDestroy {
	threads: ThreadModel[] = [];
	error: string | null = null;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	private loadingHandled: boolean = false;
	componentLoaded: boolean = false;

	constructor(
		private threadService: ThreadService,
		private authService: AuthService,
		private store: Store<AppState>
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			const threads: ThreadModel[] = await this.threadService.listThreads();

			const authorIds: string[] = Array.from(new Set(threads.map(t => t.authorId)));

			const users: AppUserModel[] = authorIds.length > 0
				? await this.authService.getUsersByIds(authorIds)
				: [];

			const userMap = users.reduce((acc, user) => {
				acc[user.uid] = user.displayName!;
				return acc;
			}, {} as { [key: string]: string });

			this.threads = threads.map(t => ({
				...t,
				authorName: userMap[t.authorId]
			})) as (ThreadModel & { authorName: string })[];
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.handleLoaded();
			this.componentLoaded = true;
		}
	}

	ngOnDestroy(): void {
		this.handleLoaded();
	}

	private handleLoaded(): void {
		if (!this.loadingHandled) {
			this.store.dispatch(hideLoading());
			this.loadingHandled = true;
		}
	}
}
