import {Component} from '@angular/core';
import {catchError, Observable, of} from "rxjs";
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

	constructor(
		private postService: PostService,
		private route: ActivatedRoute,
		protected authService: AuthService,
	) {
	}

	async ngOnInit(): Promise<void> {
		const threadId: string = this.route.snapshot.paramMap.get('id')!;
		this.currentUid = await this.authService.currentUid();
		this.posts$ = this.postService.listPostsByThread(threadId).pipe(
			catchError(e => {
				this.error = handleError(e);
				return of([]);
			})
		);
		this.loading = false;
	}
}
