import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PostCreateModel} from "../../../shared/models";
import {handleError} from "../../../shared/helpers";
import {PostService} from "../../../core/services/post.service";
import {firstValueFrom} from "rxjs";
import {Location} from "@angular/common";
import {trimmedMinLength} from "../../../shared/validators";

@Component({
	selector: 'app-post-create',
	imports: [
		ReactiveFormsModule,
	],
	templateUrl: './post-create.html',
	styleUrl: './post-create.css'
})
export class PostCreate {
	error: string | null = null;
	form: FormGroup;
	creating: boolean = false;

	constructor(
		private fb: FormBuilder,
		private postService: PostService,
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
	) {
		this.form = this.fb.group({
			body: ['', [Validators.required, trimmedMinLength(20)]],
		});
	}

	async submit(): Promise<void> {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}
		try {
			const {body} = this.form.value;

			const uid: string = (await this.authService.currentUid())!;
			const threadId: string = this.route.snapshot.paramMap.get('threadId')!;
			const payload: PostCreateModel = {
				threadId: threadId,
				body: body.trim(),
				authorId: uid,
			};

			await firstValueFrom(this.postService.createPost(payload));
			this.form.reset();
			await this.router.navigate([`/threads/${threadId}`]);
		} catch (e) {
			this.error = handleError(e);
			console.log(e)
		} finally {
			this.creating = false;
		}
	}

	onCancel(): void {
		this.location.back();
	}
}
