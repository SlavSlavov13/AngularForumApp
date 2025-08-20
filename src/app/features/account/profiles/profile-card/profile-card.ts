import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppUserModel} from '../../../../shared/models';
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
export class ProfileCard implements OnInit, OnDestroy {
	@Input({required: true}) user!: AppUserModel;
	@Input() myProfile?: boolean;
	@Input({required: true}) error!: string | null;
	private photoPending: boolean = false;
	private loadingHandled: boolean = false;
	protected loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	protected showThreads: boolean = false;
	protected showPosts: boolean = false;
	protected thisComponentLoaded: boolean = false;

	constructor(
		private store: Store<AppState>,
		private cdr: ChangeDetectorRef,
	) {
	}

	async ngOnInit(): Promise<void> {
		this.store.dispatch(showLoading());
		this.photoPending = !!this.user.photoURL;
		if (!this.photoPending) {
			this.handleLoaded();
			this.thisComponentLoaded = true;
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

	protected onPhotoLoaded(): void {
		this.handleLoaded();
		this.thisComponentLoaded = true;
	}

	protected toggleThreads(): void {
		this.showThreads = !this.showThreads;
	}

	protected togglePosts(): void {
		this.showPosts = !this.showPosts;
	}

	protected detectChanges(): void {
		this.cdr.detectChanges();
	}
}
