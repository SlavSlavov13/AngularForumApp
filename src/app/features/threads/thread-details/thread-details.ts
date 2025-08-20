import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {firstValueFrom, Observable} from 'rxjs';
import {AppUserModel, ThreadModel} from '../../../shared/models';
import {ThreadService} from '../../../core/services/thread.service';
import {AuthService} from "../../../core/services/auth.service";
import {AsyncPipe, Location} from "@angular/common";
import {handleError} from "../../../shared/helpers";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";
import {Store} from "@ngrx/store";
import {ThreadPostsList} from "../../posts/thread-posts-list/thread-posts-list";
import {ConfirmDelete} from "../../../shared/modals/confirm-delete/confirm-delete";
import {Dialog} from "@angular/cdk/dialog";

@Component({
	selector: 'app-thread-details',
	standalone: true,
	imports: [RouterLink, AsyncPipe, ThreadPostsList],
	templateUrl: './thread-details.html',
	styleUrl: './thread-details.css'
})
export class ThreadDetails implements OnInit, OnDestroy {
	error: string | null = null;
	thread!: ThreadModel;
	author!: AppUserModel;
	tags: string = '';
	currentUid: Promise<string | null> = this.authService.currentUid();
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	private loadingHandled: boolean = false;
	deleting: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private threadService: ThreadService,
		private authService: AuthService,
		private store: Store<AppState>,
		private location: Location,
		private dialog: Dialog
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			const threadId: string = this.route.snapshot.paramMap.get('threadId')!;
			this.thread = (await this.threadService.getThread(threadId))!;
			this.tags = this.thread.tags.join(', ')
			const authorUid: string = this.thread.authorId;
			this.author = await this.authService.getUser(authorUid);
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.handleLoaded();
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

	async delete(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			this.loadingHandled = false;
			const result: unknown = await firstValueFrom(this.dialog.open(ConfirmDelete, {
				data: {
					messageType: 'Delete thread ',
					itemContent: `"${this.thread.title}"`,
					messageEnd: '? This cannot be undone.'
				}
			}).closed);
			if (result) {
				await this.threadService.deleteThread(this.thread.id);
				this.location.back();
			}
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.handleLoaded();
		}
	}
}
