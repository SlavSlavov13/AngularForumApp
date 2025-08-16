import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ThreadService} from '../../../core/services/thread.service';
import {ThreadModel} from '../../../shared/models';
import {firstValueFrom} from 'rxjs';

@Component({
	selector: 'app-thread-edit',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './thread-edit.html',
	styleUrl: './thread-edit.css'
})
export class ThreadEdit implements OnInit {
	form: FormGroup;
	loading: boolean = true;
	saving: boolean = false;
	loadError: string | null = null;
	thread!: ThreadModel;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private threadService: ThreadService,
	) {
		this.form = this.fb.group({
			title: ['', [Validators.required, Validators.minLength(6)]],
			body: ['', [Validators.required, Validators.minLength(20)]],
			tags: [''],
		});
	}

	async ngOnInit(): Promise<void> {
		try {
			const id: string = this.route.snapshot.paramMap.get('id')!;
			this.thread = await firstValueFrom(this.threadService.getThread(id));

			this.form.patchValue({
				title: this.thread.title ?? '',
				body: this.thread.body ?? '',
				tags: Array.isArray(this.thread.tags) ? this.thread.tags.join(', ') : (this.thread.tags ?? ''),
			});

			this.loading = false;
		} catch (e) {
			console.error('Failed to load thread', e);
		}
	}

	async submit(): Promise<void> {
		if (this.form.invalid || this.saving) return;

		this.saving = true;
		try {
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

			this.threadService.updateThread(this.thread.id, patch);
			await this.router.navigate(['/threads', this.thread.id]);
		} catch (e) {
			console.error('Failed to update thread', e);
			this.form.setErrors({submitFailed: true});
		} finally {
			this.saving = false;
		}
	}
}
