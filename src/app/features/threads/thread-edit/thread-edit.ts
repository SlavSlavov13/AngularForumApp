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
			this.error = handleError(e);
		} finally {
			this.loading = false;
		}
	}

	async submit(): Promise<void> {
		if (this.form.invalid || this.saving) return;

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
