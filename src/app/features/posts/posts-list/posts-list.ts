import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
export class PostsList implements OnInit {
	posts: PostModel[] = [];
	error: string | null = null;
	currentUid: string | null = null;
	limitCount: number = 3;
	postsLimited: boolean = false;
	userPostsCount: number | null = null;
	@Input() uid: string | undefined;
	@Output() loadingChange: EventEmitter<void> = new EventEmitter<void>();
	finalUid: string | null = null;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	deleting: boolean = false;


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
			this.loadingChange.emit();
			const threadId: string | null = this.route.snapshot.paramMap.get('threadId');
			const uidFromURL: string | null = this.route.snapshot.paramMap.get('uid');
			this.currentUid = await this.authService.currentUid();
			// Listing posts in profile
			if (this.uid) {
				this.finalUid = this.uid;
				this.userPostsCount = await this.postService.getUserPostsCount(this.finalUid);
				this.posts = await firstValueFrom(this.postService.listPostsByUser(this.finalUid, this.limitCount));
				this.postsLimited = (this.userPostsCount > this.limitCount);
			}
			// Listing posts by thread
			else if (threadId) {
				this.posts = await firstValueFrom(this.postService.listPostsByThread(threadId));
			}
			// Listing posts by going to profile/posts for other users
			else if (uidFromURL) {
				this.finalUid = uidFromURL;
				this.userPostsCount = await this.postService.getUserPostsCount(this.finalUid)
				this.posts = await firstValueFrom(this.postService.listPostsByUser(this.finalUid));
			}
			// Listing posts by going to my-profile/posts
			else {
				this.finalUid = this.currentUid!;
				this.userPostsCount = await this.postService.getUserPostsCount(this.finalUid)
				this.posts = await firstValueFrom(this.postService.listPostsByUser(this.finalUid));
			}
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.store.dispatch(hideLoading());
		}
	}

	async delete(postId: string): Promise<void> {
		try {
			this.deleting = true;
			const post: PostModel = (await firstValueFrom(this.postService.getPost(postId)))!;
			const ok: boolean = confirm(`Delete post "${post.body}"? This cannot be undone.`);
			if (!ok) return;
			await firstValueFrom(this.postService.deletePost(postId))
			this.posts = this.posts.filter(post => post.id !== postId);
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.deleting = false;
		}
	}
}
