import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ThreadService} from '../../../core/services/thread.service';
import {ThreadModel} from '../../../shared/models';
import {from} from 'rxjs';
import {filter, map, switchMap, take} from 'rxjs/operators';

@Component({
	selector: 'app-thread-edit',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './thread-edit.html',
	styleUrl: './thread-edit.css'
})
export class ThreadEdit {
	private fb: FormBuilder = inject(FormBuilder);
	private route: ActivatedRoute = inject(ActivatedRoute);
	private router: Router = inject(Router);
	private threadService: ThreadService = inject(ThreadService);

	form: FormGroup = this.fb.group({
		title: ['', [Validators.required, Validators.minLength(6)]],
		body: ['', [Validators.required, Validators.minLength(20)]],
		tags: [''],
	});

	loading: boolean = true;
	saving: boolean = false;
	loadError: string | null = null;
	thread!: ThreadModel;

	ngOnInit(): void {
		this.route.paramMap.pipe(
			map(params => params.get('id')!),
			switchMap(id => from(this.threadService.getThread(id))),
			filter((t): t is ThreadModel => t !== null),
			take(1)
		).subscribe({
			next: (t): void => {
				this.thread = t;

				this.form.patchValue({
					title: t.title ?? '',
					body: t.body ?? '',
					tags: Array.isArray(t.tags) ? t.tags.join(', ') : (t.tags ?? ''),
				});

				this.loading = false;
			},
			error: (): void => {
				this.loadError = 'Failed to load thread.';
				this.loading = false;
			}
		});
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

			await this.threadService.updateThread(this.thread.id, patch);
			await this.router.navigate(['/threads', this.thread.id]);
		} catch (e) {
			console.error('Failed to update thread', e);
			this.form.setErrors({submitFailed: true});
		} finally {
			this.saving = false;
		}
	}
}
