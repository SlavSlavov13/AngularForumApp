import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
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
	selector: 'app-user-profile-posts-list',
	imports: [
		AsyncPipe,
		PostsVisualization
	],
	templateUrl: './user-profile-posts-list.html',
	styleUrl: './user-profile-posts-list.css'
})
export class UserProfilePostsList implements OnInit, OnDestroy {
	@Output() loadingStateChanged: EventEmitter<void> = new EventEmitter<void>();
	protected posts: PostModel[] = [];
	protected error: string | null = null;
	private uid: string | null = null;
	private limitCount: number = 3;
	private userPostsCount: number = 0;
	protected currentUid: string | null = null;
	protected loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	private loadingHandled: boolean = false;
	protected postsLimited: boolean = false;
	protected componentLoaded: boolean = false;
	protected myProfile: boolean = false;
	protected user!: AppUserModel;

	constructor(
		private postService: PostService,
		private route: ActivatedRoute,
		private authService: AuthService,
		private store: Store<AppState>,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			this.loadingStateChanged.emit();
			this.uid = this.route.snapshot.paramMap.get('uid');
			if (!this.uid) {
				this.uid = (await this.authService.currentUid())!;
				this.myProfile = true;
			}
			this.user = await this.authService.getUser(this.uid);
			this.userPostsCount = await this.postService.getUserPostsCount(this.uid);
			this.posts = await this.postService.listPostsByUser(this.uid, this.limitCount);
			this.postsLimited = (this.userPostsCount > this.limitCount);
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