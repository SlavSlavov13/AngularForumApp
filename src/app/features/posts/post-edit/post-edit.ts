import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PostModel, ThreadModel} from "../../../shared/models";
import {ActivatedRoute, Router} from "@angular/router";
import {firstValueFrom, Observable} from "rxjs";
import {handleError} from "../../../shared/helpers";
import {PostService} from "../../../core/services/post.service";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";
import {Store} from "@ngrx/store";
import {AsyncPipe, Location} from "@angular/common";
import {trimmedMinLength} from "../../../shared/validators";

@Component({
	selector: 'app-post-edit',
	imports: [
		ReactiveFormsModule,
		AsyncPipe
	],
	templateUrl: './post-edit.html',
	styleUrl: './post-edit.css'
})
export class PostEdit implements OnInit, OnDestroy {
	error: string | null = null;
	form!: FormGroup;
	saving: boolean = false;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	post!: PostModel;
	private loadingHandled: boolean = false;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private postService: PostService,
		private store: Store<AppState>,
		private location: Location,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			const postId: string = this.route.snapshot.paramMap.get('postId')!;
			this.post = await firstValueFrom(this.postService.getPost(postId));

			this.form = this.fb.group({
				body: [this.post.body, [Validators.required, trimmedMinLength(20)]],
			});
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.handleLoaded();
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

	async submit(): Promise<void> {
		try {
			if (this.form.invalid) {
				this.form.markAllAsTouched();
				return;
			}
			this.saving = true;
			const raw = this.form.value as { body: string; };

			const patch: Partial<ThreadModel> = {
				body: raw.body.trim(),
			};

			this.postService.updatePost(this.post.id, patch).subscribe({
				error: (e): void => {
					this.error = handleError(e);
				}
			});
			await this.router.navigate(['/threads', this.post.threadId]);
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.saving = false;
		}
	}

	onCancel(): void {
		this.location.back();
	}
}
