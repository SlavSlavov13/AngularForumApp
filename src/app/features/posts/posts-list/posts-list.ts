import {Component, Input} from '@angular/core';
import {firstValueFrom, Observable} from "rxjs";
import {PostModel} from "../../../shared/models";
import {handleError} from "../../../shared/helpers";
import {PostService} from "../../../core/services/post.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {AsyncPipe, DatePipe} from "@angular/common";
import {AuthService} from "../../../core/services/auth.service";
import {Store} from "@ngrx/store";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";

@Component({
	selector: 'app-posts-list',
	imports: [
		AsyncPipe,
		DatePipe,
		RouterLink
	],
	templateUrl: './posts-list.html',
	styleUrl: './posts-list.css'
})
export class PostsList {
	posts!: PostModel[];
	error: string | null = null;
	currentUid: string | null = null;
	limitCount: number = 3;
	userPostsCount: number | null = null;
	@Input() uid: string | undefined;
	finalUid: string | null = null;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);


	constructor(
		private postService: PostService,
		private route: ActivatedRoute,
		protected authService: AuthService,
		private store: Store<AppState>,
	) {
	}

	async ngOnInit(): Promise<void> {
		this.store.dispatch(showLoading());
		try {
			const threadId: string | null = this.route.snapshot.paramMap.get('id');
			const parentPath: string = this.route.parent?.parent?.routeConfig?.path ?? this.route.routeConfig?.path ?? '';
			this.currentUid = await this.authService.currentUid();
			// Listing posts in profile
			if (this.uid) {
				this.userPostsCount = await this.postService.getUserPostsCount(this.uid);
				this.finalUid = this.uid;
				this.posts = await firstValueFrom(this.postService.listPostsByUser(this.uid, this.limitCount));
			}
			// Listing posts by thread
			else if (parentPath === 'threads') {
				this.posts = await firstValueFrom(this.postService.listPostsByThread(threadId!));
			}
			// Listing posts by going to profile/posts for other users
			else if (parentPath === 'profile') {
				const userId: string = this.route.snapshot.paramMap.get('id')!;
				this.finalUid = userId;
				this.userPostsCount = await this.postService.getUserPostsCount(userId)
				this.posts = await firstValueFrom(this.postService.listPostsByUser(userId));
			}
			// Listing posts by going to my-profile/posts
			else {
				this.finalUid = this.currentUid!;
				this.userPostsCount = await this.postService.getUserPostsCount(this.currentUid!)
				this.posts = await firstValueFrom(this.postService.listPostsByUser(this.currentUid!));
			}
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.store.dispatch(hideLoading());
		}
	}

	async delete(postId: string): Promise<void> {
		const post: PostModel = (await firstValueFrom(this.postService.getPost(postId)))!;
		const ok: boolean = confirm(`Delete post "${post.body}"? This cannot be undone.`);
		if (!ok) return;

		this.postService.deletePost(postId).subscribe({
			error: (e): void => {
				this.error = handleError(e);
			}
		});
	}
}
