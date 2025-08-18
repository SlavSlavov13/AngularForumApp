import {Component, Input} from '@angular/core';
import {catchError, firstValueFrom, Observable, of} from "rxjs";
import {PostModel} from "../../../shared/models";
import {handleError} from "../../../shared/helpers";
import {PostService} from "../../../core/services/post.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {AsyncPipe, DatePipe} from "@angular/common";
import {AuthService} from "../../../core/services/auth.service";

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
	posts$!: Observable<PostModel[]>;
	loading: boolean = true;
	error: string | null = null;
	currentUid: string | null = null;
	@Input() uid: string | undefined;

	constructor(
		private postService: PostService,
		private route: ActivatedRoute,
		protected authService: AuthService,
	) {
	}

	async ngOnInit(): Promise<void> {
		const threadId: string | null = this.route.snapshot.paramMap.get('id');
		const parentPath: string = this.route.parent?.parent?.routeConfig?.path ?? this.route.routeConfig?.path ?? '';
		this.currentUid = await this.authService.currentUid();
		// Listing posts in profile
		if (this.uid) {
			this.posts$ = this.postService.listPostsByUser(this.uid).pipe(
				catchError(e => {
					this.error = handleError(e);
					return of([]);
				})
			);
		}
		// Listing posts by thread
		else if (parentPath === 'threads') {
			this.posts$ = this.postService.listPostsByThread(threadId!).pipe(
				catchError(e => {
					this.error = handleError(e);
					return of([]);
				})
			);
		}
		// Listing posts by going to profile/posts for other users
		else if (parentPath === 'profile') {
			const userId: string = this.route.snapshot.paramMap.get('id')!;
			this.posts$ = this.postService.listPostsByUser(userId).pipe(
				catchError(e => {
					this.error = handleError(e);
					return of([]);
				})
			);
		}
		// Listing posts by going to my-profile/posts
		else {
			this.posts$ = this.postService.listPostsByUser(this.currentUid!).pipe(
				catchError(e => {
					this.error = handleError(e);
					return of([]);
				})
			);
		}
		this.loading = false;
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
