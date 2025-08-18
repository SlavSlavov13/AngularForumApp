import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ThreadModel} from '../../../shared/models';
import {ThreadService} from '../../../core/services/thread.service';
import {firstValueFrom, Observable} from "rxjs";
import {handleError} from "../../../shared/helpers";
import {Store} from "@ngrx/store";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";
import {AsyncPipe} from "@angular/common";

@Component({
	selector: 'app-threads-list',
	standalone: true,
	imports: [RouterLink, AsyncPipe],
	templateUrl: './threads-list.html',
	styleUrl: './threads-list.css'
})
export class ThreadsList implements OnInit {
	threads!: ThreadModel[];
	error: string | null = null;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);

	constructor(
		private threadService: ThreadService,
		private store: Store<AppState>
	) {
	}

	async ngOnInit(): Promise<void> {
		this.store.dispatch(showLoading());
		try {
			this.threads = await firstValueFrom(
				this.threadService.listThreads()
			);
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.store.dispatch(hideLoading());
		}
	}

}
