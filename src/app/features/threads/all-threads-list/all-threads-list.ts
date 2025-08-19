import {Component} from '@angular/core';
import {ThreadModel} from "../../../shared/models";
import {firstValueFrom, Observable} from "rxjs";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";
import {ThreadService} from "../../../core/services/thread.service";
import {Store} from "@ngrx/store";
import {handleError} from "../../../shared/helpers";
import {ThreadsVisualization} from "../threads-visualization/threads-visualization";

@Component({
	selector: 'app-all-threads-list',
	imports: [
		ThreadsVisualization
	],
	templateUrl: './all-threads-list.html',
	styleUrl: './all-threads-list.css'
})
export class AllThreadsList {
	threads: ThreadModel[] = [];
	error: string | null = null;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	componentLoaded: boolean = false;

	constructor(
		private threadService: ThreadService,
		private store: Store<AppState>
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			this.threads = await firstValueFrom(this.threadService.listThreads());
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.store.dispatch(hideLoading());
			this.componentLoaded = true;
		}
	}
}
