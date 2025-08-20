import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PostService} from "../../../core/services/post.service";
import {PostModel} from "../../../shared/models";
import {firstValueFrom} from "rxjs";
import {handleError} from "../../../shared/helpers";
import {Dialog} from "@angular/cdk/dialog";
import {ConfirmDelete} from "../../../shared/modals/confirm-delete/confirm-delete";

@Component({
	selector: 'app-post-delete',
	imports: [],
	templateUrl: './post-delete.html',
	styleUrl: './post-delete.css'
})
export class PostDelete {
	@Input({required: true}) postId!: string;
	@Output() deletionError: EventEmitter<string> = new EventEmitter<string>;
	@Output() postDeleted: EventEmitter<string> = new EventEmitter<string>();
	error: string | null = null;

	constructor(
		private postService: PostService,
		private dialog: Dialog
	) {
	}

	async delete(): Promise<void> {
		try {
			const post: PostModel = (await firstValueFrom(this.postService.getPost(this.postId)))!;
			const result: unknown = await firstValueFrom(this.dialog.open(ConfirmDelete, {
				data: {message: `Delete post "${post.body}"? This cannot be undone.`}
			}).closed);

			if (result) {
				await firstValueFrom(this.postService.deletePost(this.postId));
				this.postDeleted.emit(this.postId);
			}
		} catch (e) {
			this.error = handleError(e);
			this.deletionError.emit(this.error)
		}
	}
}
