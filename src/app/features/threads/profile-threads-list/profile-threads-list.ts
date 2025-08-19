import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ThreadService} from '../../../core/services/thread.service';
import {AsyncPipe, DatePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {firstValueFrom, Observable} from "rxjs";
import {ThreadModel} from "../../../shared/models";
import {handleError} from "../../../shared/helpers";
import {Store} from "@ngrx/store";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";

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
	limitCount: number = 3;
	userThreadsCount!: number;
	@Input() profileCard: boolean = false;
	@Input({required: true}) uid!: string;
	@Output() loadingChange: EventEmitter<void> = new EventEmitter<void>();

	constructor(
		protected threadService: ThreadService,
		private store: Store<AppState>,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			this.loadingChange.emit();
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

}
