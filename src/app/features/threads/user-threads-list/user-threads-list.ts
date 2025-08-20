import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppUserModel, ThreadModel} from "../../../shared/models";
import {Observable} from "rxjs";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";
import {ThreadService} from "../../../core/services/thread.service";
import {AuthService} from "../../../core/services/auth.service";
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {handleError} from "../../../shared/helpers";
import {ThreadsVisualization} from "../threads-visualization/threads-visualization";
import {AsyncPipe} from "@angular/common";

@Component({
	selector: 'app-user-threads-list',
	imports: [
		ThreadsVisualization,
		AsyncPipe
	],
	templateUrl: './user-threads-list.html',
	styleUrl: './user-threads-list.css'
})
export class UserThreadsList implements OnInit, OnDestroy {
	protected threads: ThreadModel[] = [];
	private uid: string | null = null;
	protected myProfile: boolean = false;
	protected user!: AppUserModel;
	protected error: string | null = null;
	protected loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	private loadingHandled: boolean = false;
	protected componentLoaded: boolean = false;

	constructor(
		private threadService: ThreadService,
		private authService: AuthService,
		private store: Store<AppState>,
		private route: ActivatedRoute,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			// Another user profile
			this.uid = this.route.snapshot.paramMap.get('uid');
			// My profile
			if (!this.uid) {
				this.uid = (await this.authService.currentUid())!;
				this.myProfile = true;
			}
			this.user = await this.authService.getUser(this.uid);
			this.threads = await this.threadService.listThreadsByUser(this.uid);
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
