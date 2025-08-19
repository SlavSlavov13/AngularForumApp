import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PostModel, ThreadModel} from "../../../shared/models";
import {ActivatedRoute, Router} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {handleError} from "../../../shared/helpers";
import {PostService} from "../../../core/services/post.service";

@Component({
	selector: 'app-post-edit',
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './post-edit.html',
	styleUrl: './post-edit.css'
})
export class PostEdit implements OnInit {
	error: string | null = null;
	form!: FormGroup;
	loading: boolean = true;
	saving: boolean = false;
	post!: PostModel;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private postService: PostService,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			const postId: string = this.route.snapshot.paramMap.get('postId')!;
			this.post = await firstValueFrom(this.postService.getPost(postId));

			this.form = this.fb.group({
				body: [this.post.body, [Validators.required, Validators.minLength(20)]],
			});

			this.loading = false;
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.loading = false;
		}
	}

	async submit(): Promise<void> {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}
		this.saving = true;
		const raw = this.form.value as { body: string; };

		const patch: Partial<ThreadModel> = {
			body: raw.body,
		};

		this.postService.updatePost(this.post.id, patch).subscribe({
			error: (e): void => {
				this.error = handleError(e);
			}
		});
		await this.router.navigate(['/threads', this.post.threadId]);
		this.loading = false;
	}
}
