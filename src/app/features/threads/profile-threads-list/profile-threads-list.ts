import {Component, Input, OnInit} from '@angular/core';
import {ThreadService} from '../../../core/services/thread.service';
import {AsyncPipe, DatePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {catchError, Observable, of} from "rxjs";
import {ThreadModel} from "../../../shared/models";
import {handleError} from "../../../shared/helpers";

@Component({
	selector: 'app-profile-threads-list',
	standalone: true,
	imports: [
		AsyncPipe,
		RouterLink,
		DatePipe
	],
	templateUrl: './profile-threads-list.html'
})
export class ProfileThreadsList implements OnInit {
	error: string | null = null;
	loading: boolean = true;
	threads$: Observable<ThreadModel[]> = new Observable<ThreadModel[]>();
	limitCount: number = 3;
	userThreadsCount!: number;
	@Input() profileCard: boolean = false;
	@Input({required: true}) uid!: string;

	constructor(protected threadService: ThreadService) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.userThreadsCount = await this.threadService.getUserThreadCount(this.uid);
			if (this.profileCard) {
				this.threads$ = this.threadService.listThreadsByUser(this.uid, this.limitCount).pipe(
					catchError(e => {
						this.error = handleError(e);
						return of([]);
					})
				);
			} else {
				this.threads$ = this.threadService.listThreadsByUser(this.uid).pipe(
					catchError(e => {
						this.error = handleError(e);
						return of([]);
					})
				);
			}
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.loading = false;
		}

	}

}
