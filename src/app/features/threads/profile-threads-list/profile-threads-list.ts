import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ThreadService} from '../../../core/services/thread.service';
import {AsyncPipe, DatePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {firstValueFrom, Observable} from "rxjs";
import {ThreadModel} from "../../../shared/models";
import {handleError} from "../../../shared/helpers";
import {Store} from "@ngrx/store";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";
import {AuthService} from "../../../core/services/auth.service";

@Component({
	selector: 'app-profile-threads-list',
	standalone: true,
	imports: [
		AsyncPipe,
		RouterLink,
		DatePipe
	],
	templateUrl: './profile-threads-list.html'
})
export class ProfileThreadsList implements OnInit {
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	error: string | null = null;
	threads!: ThreadModel[];
	currentUid: string | null = null;
	deleting: boolean = false;
	limitCount: number = 3;
	userThreadsCount!: number;
	@Input() profileCard: boolean = false;
	@Input({required: true}) uid!: string;
	@Output() loadingChange: EventEmitter<void> = new EventEmitter<void>();

	constructor(
		protected threadService: ThreadService,
		protected authService: AuthService,
		private store: Store<AppState>,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			this.loadingChange.emit();
			this.currentUid = await this.authService.currentUid();
			this.userThreadsCount = await this.threadService.getUserThreadsCount(this.uid);
			if (this.profileCard) {
				this.threads = await firstValueFrom(this.threadService.listThreadsByUser(this.uid, this.limitCount))
			} else {
				this.threads = await firstValueFrom(this.threadService.listThreadsByUser(this.uid))
			}
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.store.dispatch(hideLoading());
		}
	}

	async delete(threadId: string): Promise<void> {
		try {
			this.deleting = true;
			const thread: ThreadModel = (await firstValueFrom(this.threadService.getThread(threadId)))!;
			const ok: boolean = confirm(`Delete thread "${thread.title}"? This cannot be undone.`);
			if (!ok) return;
			await firstValueFrom(this.threadService.deleteThread(threadId))
			this.threads = this.threads.filter(thread => thread.id !== threadId);
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.deleting = false;
		}
	}
}
