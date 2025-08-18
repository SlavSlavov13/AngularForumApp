import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ThreadModel} from '../../../shared/models';
import {ThreadService} from '../../../core/services/thread.service';
import {Observable, of} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {handleError} from "../../../shared/helpers";
import {catchError, map, startWith} from "rxjs/operators";

@Component({
	selector: 'app-threads-list',
	standalone: true,
	imports: [RouterLink, AsyncPipe],
	templateUrl: './threads-list.html',
	styleUrl: './threads-list.css'
})
export class ThreadsList {
	threadsState$: Observable<{ threads: ThreadModel[]; error: string | null }>;

	constructor(private threadService: ThreadService) {
		this.threadsState$ = this.threadService.listThreads().pipe(
			map(threads => ({threads, error: null})),
			catchError(e => of({threads: [], error: handleError(e)})),
			startWith({threads: [], error: null}) // Initial blank/no-error state for template stability
		);
	}
}
