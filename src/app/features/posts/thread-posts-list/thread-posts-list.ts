import {Component, OnInit} from '@angular/core';
import {AppUserModel, PostModel} from "../../../shared/models";
import {firstValueFrom, Observable} from "rxjs";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";
import {PostService} from "../../../core/services/post.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import {Store} from "@ngrx/store";
import {handleError} from "../../../shared/helpers";
import {PostsVisualization} from "../posts-visualization/posts-visualization";

@Component({
	selector: 'app-thread-posts-list',
	imports: [
		PostsVisualization
	],
	templateUrl: './thread-posts-list.html',
	styleUrl: './thread-posts-list.css'
})
export class ThreadPostsList implements OnInit {
	posts: PostModel[] = [];
	threadId!: string;
	error: string | null = null;
	currentUid: string | null = null;
	limitCount: number = 3;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	componentLoaded: boolean = false;
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
			this.currentUid = await this.authService.currentUid();
			this.threadId = this.route.snapshot.paramMap.get('threadId')!;
			this.posts = await firstValueFrom(this.postService.listPostsByThread(this.threadId, this.limitCount));
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.store.dispatch(hideLoading());
			this.componentLoaded = true;
		}
	}
}