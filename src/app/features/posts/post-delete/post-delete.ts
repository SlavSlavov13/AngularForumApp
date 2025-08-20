import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PostService} from "../../../core/services/post.service";
import {PostModel} from "../../../shared/models";
import {firstValueFrom} from "rxjs";
import {handleError} from "../../../shared/helpers";

@Component({
	selector: 'app-post-delete',
	imports: [],
	templateUrl: './post-delete.html',
	styleUrl: './post-delete.css'
})
export class PostDelete {
	@Input({required: true}) postId!: string;
	@Output() deleting: EventEmitter<void> = new EventEmitter<void>;
	@Output() postDeleted: EventEmitter<string> = new EventEmitter<string>();
	error?: string;

	constructor(
		private postService: PostService
	) {
	}


	async delete(): Promise<void> {
		try {
			this.deleting.emit();
			const post: PostModel = (await firstValueFrom(this.postService.getPost(this.postId)))!;
			const ok: boolean = confirm(`Delete post "${post.body}"? This cannot be undone.`);
			if (!ok) return;
			await firstValueFrom(this.postService.deletePost(this.postId));
			this.postDeleted.emit(this.postId);
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.postDeleted.emit(this.postId);
		}
	}
}
