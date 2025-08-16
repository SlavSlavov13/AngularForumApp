import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ThreadModel} from '../../../shared/models';
import {ThreadService} from '../../../core/services/thread.service';
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
	selector: 'app-threads-list',
	standalone: true,
	imports: [RouterLink, AsyncPipe],
	templateUrl: './threads-list.html',
	styleUrl: './threads-list.css'
})
export class ThreadsList implements OnInit {
	threads$!: Observable<ThreadModel[]>;
	loading: boolean = true;
	error: string | null = null;

	constructor(private threadService: ThreadService) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.threads$ = this.threadService.listThreads();
		} catch (e) {
			console.error('Failed to load threads', e);
			this.error = 'Failed to load threads.';
		} finally {
			this.loading = false;
		}
	}
}
