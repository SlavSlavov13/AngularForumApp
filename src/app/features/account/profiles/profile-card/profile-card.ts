import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppUserModel} from '../../../../shared/models';
import {AuthService} from "../../../../core/services/auth.service";
import {RouterLink} from "@angular/router";
import {PostsList} from "../../../posts/posts-list/posts-list";
import {Observable} from "rxjs";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../../store";
import {Store} from "@ngrx/store";
import {UserProfileThreadsList} from "../../../threads/user-profile-threads-list/user-profile-threads-list";

@Component({
	selector: 'app-profile-card',
	standalone: true,
	imports: [CommonModule, RouterLink, PostsList, UserProfileThreadsList],
	templateUrl: './profile-card.html',
	styleUrl: './profile-card.css'
})
export class ProfileCard implements OnInit {
	@Input({required: true}) user!: AppUserModel;
	@Input() myProfile?: boolean;
	@Input() error!: string | null;
	photoPending: boolean = false;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	showThreads: boolean = false;
	showPosts: boolean = false;
	thisComponentLoaded: boolean = false;

	constructor(
		protected authService: AuthService,
		private store: Store<AppState>,
	) {
	}

	async ngOnInit(): Promise<void> {
		this.store.dispatch(showLoading());
		this.photoPending = !!this.user.photoURL;
		if (!this.photoPending) {
			this.store.dispatch(hideLoading());
			this.thisComponentLoaded = true;
		}
	}

	onPhotoLoaded(): void {
		this.store.dispatch(hideLoading());
		this.thisComponentLoaded = true;
	}

	toggleThreads(): void {
		this.showThreads = !this.showThreads;
	}

	togglePosts(): void {
		this.showPosts = !this.showPosts;
	}
}
