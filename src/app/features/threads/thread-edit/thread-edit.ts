import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ThreadService} from '../../../core/services/thread.service';
import {ThreadModel} from '../../../shared/models';
import {firstValueFrom} from 'rxjs';
import {handleError} from "../../../shared/helpers";

@Component({
	selector: 'app-thread-edit',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './thread-edit.html',
	styleUrl: './thread-edit.css'
})
export class ThreadEdit implements OnInit {
	error: string | null = null;
	form!: FormGroup;
	loading: boolean = true;
	saving: boolean = false;
	thread!: ThreadModel;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private threadService: ThreadService,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			const threadId: string = this.route.snapshot.paramMap.get('threadId')!;
			this.thread = await firstValueFrom(this.threadService.getThread(threadId));

			this.form = this.fb.group({
				title: [this.thread.title, [Validators.required, Validators.minLength(6)]],
				body: [this.thread.body, [Validators.required, Validators.minLength(20)]],
				tags: [Array.isArray(this.thread.tags) ? this.thread.tags.join(', ') : (this.thread.tags ?? '')],
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
		const raw = this.form.value as { title: string; body: string; tags?: string };

		const tagsArray: string[] =
			raw.tags && raw.tags.trim().length
				? raw.tags.split(',').map(t => t.trim()).filter(Boolean)
				: [];

		const patch: Partial<ThreadModel> = {
			title: raw.title,
			body: raw.body,
			tags: tagsArray,
		};

		this.threadService.updateThread(this.thread.id, patch).subscribe({
			error: (e): void => {
				this.error = handleError(e);
			}
		});
		await this.router.navigate(['/threads', this.thread.id]);
		this.loading = false;
	}
}
