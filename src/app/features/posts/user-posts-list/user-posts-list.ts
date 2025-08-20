import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppUserModel, PostModel} from "../../../shared/models";
import {Observable} from "rxjs";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";
import {PostService} from "../../../core/services/post.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import {Store} from "@ngrx/store";
import {handleError} from "../../../shared/helpers";
import {AsyncPipe} from "@angular/common";
import {PostsVisualization} from "../posts-visualization/posts-visualization";

@Component({
	selector: 'app-user-posts-list',
	imports: [
		AsyncPipe,
		PostsVisualization
	],
	templateUrl: './user-posts-list.html',
	styleUrl: './user-posts-list.css'
})
export class UserPostsList implements OnInit, OnDestroy {
	posts: PostModel[] = [];
	error: string | null = null;
	uid: string | null = null;
	userPostsCount: number | null = null;
	myProfile: boolean = false;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	private loadingHandled: boolean = false;
	componentLoaded: boolean = false;
	currentUid: string | null = null;
	user!: AppUserModel;

	constructor(
		private postService: PostService,
		private route: ActivatedRoute,
		protected authService: AuthService,
		private store: Store<AppState>,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			this.uid = this.route.snapshot.paramMap.get('uid');
			if (!this.uid) {
				this.uid = (await this.authService.currentUid())!;
				this.myProfile = true;
			}
			this.user = await this.authService.getUser(this.uid);
			this.userPostsCount = await this.postService.getUserPostsCount(this.uid);
			this.posts = await this.postService.listPostsByUser(this.uid);
			this.currentUid = await this.authService.currentUid();
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