import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ThreadService} from "../../../core/services/thread.service";
import {AppUserModel, ThreadCreateModel} from "../../../shared/models";
import {AuthService} from "../../../core/services/auth.service";
import {Router} from "@angular/router";
import {DocumentReference} from '@angular/fire/firestore';
import {firstValueFrom} from "rxjs";
import {handleError} from "../../../shared/helpers";

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
	error: string | null = null;
	form: FormGroup;
	creating: boolean = false;

	constructor(
		private fb: FormBuilder,
		private threadService: ThreadService,
		private authService: AuthService,
		private router: Router,
	) {
		this.form = this.fb.group({
			title: ['', [Validators.required, Validators.minLength(6)]],
			body: ['', [Validators.required, Validators.minLength(20)]],
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
			const author: AppUserModel = (await this.authService.getUser(uid))!;
			const payload: ThreadCreateModel = {
				title,
				body,
				tags: tags
					? tags.split(',').map((t: string): string => t.trim()).filter(Boolean)
					: [],
				authorId: uid,
				authorName: author.displayName!
			};

			const docRef: DocumentReference = await firstValueFrom(this.threadService.createThread(payload));
			this.form.reset();
			await this.router.navigate([`/threads/${docRef.id}`]);
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.creating = false;
		}
	}
}
