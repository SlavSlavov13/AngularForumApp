import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ThreadService} from "../../../core/services/thread.service";
import {ThreadCreateModel} from "../../../shared/models";
import {AuthService} from "../../../core/services/auth.service";
import {Router} from "@angular/router";
import {DocumentReference} from '@angular/fire/firestore';
import {handleError} from "../../../shared/helpers";
import {Location} from "@angular/common";
import {trimmedMinLength} from "../../../shared/validators";

@Component({
	selector: 'app-thread-create',
	standalone: true,
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './thread-create.html',
	styleUrl: './thread-create.css'
})
export class ThreadCreate {
	protected error: string | null = null;
	protected form: FormGroup;
	protected creating: boolean = false;

	constructor(
		private fb: FormBuilder,
		private threadService: ThreadService,
		private authService: AuthService,
		private router: Router,
		private location: Location,
	) {
		this.form = this.fb.group({
			title: ['', [Validators.required, trimmedMinLength(6)]],
			body: ['', [Validators.required, trimmedMinLength(20)]],
			tags: ['']
		});
	}

	async submit(): Promise<void> {
		try {
			if (this.form.invalid) {
				this.form.markAllAsTouched();
				return;
			}
			this.creating = true;

			const {title, body, tags} = this.form.value;

			const uid: string = (await this.authService.currentUid())!;
			const payload: ThreadCreateModel = {
				title: title.trim(),
				body: body.trim(),
				tags: tags
					? tags.split(',').map((t: string): string => t.trim()).filter(Boolean)
					: [],
				authorId: uid,
			};

			const docRef: DocumentReference = await this.threadService.createThread(payload);
			this.form.reset();
			await this.router.navigate([`/threads/${docRef.id}`]);
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.creating = false;
		}
	}

	protected onCancel(): void {
		this.location.back();
	}
}
