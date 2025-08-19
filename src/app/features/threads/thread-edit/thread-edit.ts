import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ThreadService} from '../../../core/services/thread.service';
import {ThreadModel} from '../../../shared/models';
import {firstValueFrom, Observable} from 'rxjs';
import {handleError} from "../../../shared/helpers";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";
import {Store} from "@ngrx/store";
import {AsyncPipe} from "@angular/common";

@Component({
	selector: 'app-thread-edit',
	standalone: true,
	imports: [ReactiveFormsModule, AsyncPipe],
	templateUrl: './thread-edit.html',
	styleUrl: './thread-edit.css'
})
export class ThreadEdit implements OnInit {
	error: string | null = null;
	form!: FormGroup;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	saving: boolean = false;
	thread!: ThreadModel;
	submitting: boolean = false;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private threadService: ThreadService,
		private store: Store<AppState>,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			const threadId: string = this.route.snapshot.paramMap.get('threadId')!;
			this.thread = await firstValueFrom(this.threadService.getThread(threadId));

			this.form = this.fb.group({
				title: [this.thread.title, [Validators.required, Validators.minLength(6)]],
				body: [this.thread.body, [Validators.required, Validators.minLength(20)]],
				tags: [Array.isArray(this.thread.tags) ? this.thread.tags.join(', ') : (this.thread.tags ?? '')],
			});
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.store.dispatch(hideLoading());
		}
	}

	async submit(): Promise<void> {
		try {
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

			await firstValueFrom(this.threadService.updateThread(this.thread.id, patch))
			await this.router.navigate(['/threads', this.thread.id]);
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.submitting = false;
		}
	}
}
