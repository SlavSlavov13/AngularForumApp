import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ThreadModel} from '../../../shared/models';
import {ThreadService} from '../../../core/services/thread.service';
import {catchError, Observable, of} from "rxjs";
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
		this.threads$ = this.threadService.listThreads().pipe(
			catchError(e => {
				this.error = (e as Error)?.message || 'Failed to list threads.';
				return of([]);
			})
		);
		this.loading = false;
	}
}
