import {Component, OnInit} from '@angular/core';
import {firstValueFrom, Observable} from "rxjs";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";
import {AppUserModel, ThreadModel} from "../../../shared/models";
import {AuthService} from "../../../core/services/auth.service";
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {handleError} from "../../../shared/helpers";
import {ThreadsVisualization} from "../threads-visualization/threads-visualization";
import {AsyncPipe} from "@angular/common";
import {ThreadService} from "../../../core/services/thread.service";

@Component({
	selector: 'app-user-profile-threads',
	imports: [
		ThreadsVisualization,
		AsyncPipe
	],
	templateUrl: './user-profile-threads.html',
	styleUrl: './user-profile-threads.css'
})
export class UserProfileThreads implements OnInit {
	uid: string | null = null;
	error: string | null = null;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	componentLoaded: boolean = false;
	myProfile: boolean = false;
	countLimit: number = 3;
	threads: ThreadModel[] = [];
	user!: AppUserModel;

	constructor(
		protected authService: AuthService,
		private threadService: ThreadService,
		private store: Store<AppState>,
		private route: ActivatedRoute,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			// Another user's profile
			this.uid = this.route.snapshot.paramMap.get('uid');
			// My profile
			if (!this.uid) {
				this.uid = (await this.authService.currentUid())!;
				this.myProfile = true;
			}
			this.user = await this.authService.getUser(this.uid);
			this.threads = await firstValueFrom(this.threadService.listThreadsByUser(this.uid, this.countLimit))
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.store.dispatch(hideLoading());
			this.componentLoaded = true;
		}
	}
}
