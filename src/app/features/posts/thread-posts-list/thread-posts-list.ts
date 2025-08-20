import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppUserModel, PostModel} from "../../../shared/models";
import {AppState, hideLoading, showLoading} from "../../../store";
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
export class ThreadPostsList implements OnInit, OnDestroy {
	protected posts: (PostModel & { authorName?: string })[] = [];
	private threadId!: string;
	protected error: string | null = null;
	protected currentUid: string | null = null;
	private loadingHandled: boolean = false;
	protected componentLoaded: boolean = false;

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

			const posts: PostModel[] = await this.postService.listPostsByThread(this.threadId);

			const authorIds: string[] = Array.from(new Set(posts.map(p => p.authorId)));
			const users: AppUserModel[] = authorIds.length > 0
				? await this.authService.getUsersByIds(authorIds)
				: [];

			const userMap = users.reduce((acc, user) => {
				acc[user.uid] = user.displayName!;
				return acc;
			}, {} as { [key: string]: string });

			this.posts = posts.map(p => ({
				...p,
				authorName: userMap[p.authorId]
			})) as (PostModel & { authorName: string })[];
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