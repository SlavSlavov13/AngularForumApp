import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ThreadService} from "../../../core/services/thread.service";
import {ThreadCreateModel} from "../../../shared/models";
import {AuthService} from "../../../core/services/auth.service";
import {DocumentReference} from "@angular/fire/firestore";
import {Router} from "@angular/router";

@Component({
	selector: 'app-thread-create',
	standalone: true,
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './thread-create.html',
	styleUrls: ['./thread-create.css'] // Fixed plural form
})
export class ThreadCreate {
	form: FormGroup;
	private router: Router = inject(Router);

	constructor(
		private fb: FormBuilder,
		private threadService: ThreadService,
		private auth: AuthService,
	) {
		this.form = this.fb.group({
			title: ['', [Validators.required, Validators.minLength(6)]],
			body: ['', [Validators.required, Validators.minLength(20)]],
			tags: ['']
		});
	}

	async submit(): Promise<void> {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const {title, body, tags} = this.form.value;

		// Prepare payload to match ThreadCreate interface
		const payload: ThreadCreateModel = {
			title,
			body,
			tags: tags
				? tags.split(',').map((t: string): string => t.trim()).filter(Boolean)
				: [],
			authorId: this.auth.currentUid()!
		};

		try {
			const docRef: DocumentReference = await this.threadService.createThread(payload);
			this.form.reset();
			await this.router.navigate([`/threads/${docRef.id}`]);
		} catch (error) {
			console.error('Error creating thread:', error);
		}
	}
}
