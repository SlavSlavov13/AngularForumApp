import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ThreadService} from "../../../core/services/thread.service";
import {ThreadCreateModel} from "../../../shared/models";
import {AuthService} from "../../../core/services/auth.service";
import {Router} from "@angular/router";
import {DocumentReference} from '@angular/fire/firestore';
import {firstValueFrom} from "rxjs";

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
	form: FormGroup;

	constructor(
		private fb: FormBuilder,
		private threadService: ThreadService,
		private auth: AuthService,
		private router: Router,
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

		const uid: string = (await this.auth.currentUid())!;
		const payload: ThreadCreateModel = {
			title,
			body,
			tags: tags
				? tags.split(',').map((t: string): string => t.trim()).filter(Boolean)
				: [],
			authorId: uid
		};

		try {
			const docRef: DocumentReference = await firstValueFrom(this.threadService.createThread(payload));
			this.form.reset();
			await this.router.navigate([`/threads/${docRef.id}`]);
		} catch (error) {
			console.error('Error creating thread:', error);
		}
	}
}
