import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppUserModel} from '../../../../shared/models';
import {AuthService} from "../../../../core/services/auth.service";
import {RouterLink} from "@angular/router";
import {Observable} from "rxjs";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../../store";
import {Store} from "@ngrx/store";
import {UserProfileThreadsList} from "../../../threads/user-profile-threads-list/user-profile-threads-list";
import {UserProfilePostsList} from "../../../posts/user-profile-posts-list/user-profile-posts-list";

@Component({
	selector: 'app-profile-card',
	standalone: true,
	imports: [CommonModule, RouterLink, UserProfileThreadsList, UserProfilePostsList],
	templateUrl: './profile-card.html',
	styleUrl: './profile-card.css'
})
export class ProfileCard implements OnInit {
	@Input({required: true}) user!: AppUserModel;
	@Input() myProfile?: boolean;
	@Input({required: true}) error!: string | null;
	photoPending: boolean = false;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	showThreads: boolean = false;
	showPosts: boolean = false;
	thisComponentLoaded: boolean = false;

	constructor(
		protected authService: AuthService,
		private store: Store<AppState>,
		private cdr: ChangeDetectorRef,
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

	detectChanges(): void {
		this.cdr.detectChanges();
	}
}
