import {Component} from '@angular/core';
import {catchError, Observable, of} from "rxjs";
import {PostModel} from "../../../shared/models";
import {handleError} from "../../../shared/helpers";
import {PostService} from "../../../core/services/post.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {AsyncPipe, DatePipe} from "@angular/common";

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

	constructor(
		private postService: PostService,
		private route: ActivatedRoute,
	) {
	}

	async ngOnInit(): Promise<void> {
		const threadId: string = this.route.snapshot.paramMap.get('id')!;
		this.posts$ = this.postService.listPostsByThread(threadId).pipe(
			catchError(e => {
				this.error = handleError(e);
				return of([]);
			})
		);
		this.loading = false;
	}
}
