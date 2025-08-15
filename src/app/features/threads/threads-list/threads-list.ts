import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ThreadModel} from '../../../shared/models';
import {ThreadService} from '../../../core/services/thread.service';

@Component({
	selector: 'app-threads-list',
	standalone: true,
	imports: [RouterLink],
	templateUrl: './threads-list.html',
	styleUrl: './threads-list.css'
})
export class ThreadsList implements OnInit {
	threads: ThreadModel[] | null = null;
	loading = true;
	error: string | null = null;

	private threadService = inject(ThreadService);

	async ngOnInit(): Promise<void> {
		try {
			this.threads = await this.threadService.listThreads();
		} catch (e) {
			console.error('Failed to load threads', e);
			this.error = 'Failed to load threads.';
		} finally {
			this.loading = false;
		}
	}
}
