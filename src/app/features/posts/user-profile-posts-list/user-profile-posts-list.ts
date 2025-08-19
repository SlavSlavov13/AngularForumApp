import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppUserModel, PostModel} from "../../../shared/models";
import {firstValueFrom, Observable} from "rxjs";
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
export class UserProfilePostsList implements OnInit {
	@Output() loadingStateChanged: EventEmitter<void> = new EventEmitter<void>();
	posts: PostModel[] = [];
	error: string | null = null;
	uid: string | null = null;
	limitCount: number = 3;
	userPostsCount: number | null = null;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	postsLimited: boolean = false;
	componentLoaded: boolean = false;
	myProfile: boolean = false;
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
			this.loadingStateChanged.emit();
			this.uid = this.route.snapshot.paramMap.get('uid');
			if (!this.uid) {
				this.uid = (await this.authService.currentUid())!;
				this.myProfile = true;
			}
			this.user = await this.authService.getUser(this.uid);
			this.userPostsCount = await this.postService.getUserPostsCount(this.uid);
			this.posts = await firstValueFrom(this.postService.listPostsByUser(this.uid, this.limitCount));
			this.postsLimited = (this.userPostsCount > this.limitCount);
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.store.dispatch(hideLoading());
			this.componentLoaded = true;
		}
	}
}