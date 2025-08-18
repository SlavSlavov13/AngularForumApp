import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppUserModel} from '../../../../shared/models';
import {MyThreads} from "../../../threads/my-threads/my-threads";
import {AuthService} from "../../../../core/services/auth.service";
import {UserThreads} from "../../../threads/user-threads/user-threads";
import {RouterLink} from "@angular/router";
import {PostsList} from "../../../posts/posts-list/posts-list";
import {Observable} from "rxjs";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../../store";
import {Store} from "@ngrx/store";

@Component({
	selector: 'app-profile-card',
	standalone: true,
	imports: [CommonModule, MyThreads, UserThreads, RouterLink, PostsList],
	templateUrl: './profile-card.html',
	styleUrl: './profile-card.css'
})
export class ProfileCard implements OnInit {
	@Input({required: true}) user!: AppUserModel;
	photoPending: boolean = false;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	showThreads: boolean = false;
	showPosts: boolean = false;
	currentUid: string | null = null;

	constructor(
		protected authService: AuthService,
		private store: Store<AppState>,
	) {
	}

	async ngOnInit(): Promise<void> {
		this.store.dispatch(showLoading());
		this.currentUid = await this.authService.currentUid();
		this.photoPending = !!this.user.photoURL;
		if (!this.photoPending) {
			this.store.dispatch(hideLoading());
		}
	}

	onPhotoLoaded(): void {
		this.store.dispatch(hideLoading());
	}

	toggleThreads(): void {
		this.showThreads = !this.showThreads;
	}

	togglePosts(): void {
		this.showPosts = !this.showPosts;
	}
}
