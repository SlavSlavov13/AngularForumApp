import {Component, Input} from '@angular/core';
import {AppUserModel, ThreadModel} from "../../../shared/models";
import {Observable} from "rxjs";
import {AppState, selectLoadingVisible} from "../../../store";
import {Store} from "@ngrx/store";
import {AsyncPipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {PluralizePipe} from "../../../shared/pipes/pluralize-pipe";

@Component({
	selector: 'app-threads-visualization',
	imports: [
		AsyncPipe,
		RouterLink,
		PluralizePipe
	],
	templateUrl: './threads-visualization.html',
	styleUrl: './threads-visualization.css'
})
export class ThreadsVisualization {
	@Input({required: true}) threads!: (ThreadModel & { authorName?: string })[];
	@Input({required: true}) error!: string | null;
	@Input() threadsLimited?: boolean;
	@Input() profileCardUser?: AppUserModel;
	@Input() inProfile?: boolean;

	protected loading$: Observable<boolean> = this.store.select(selectLoadingVisible);

	constructor(
		private store: Store<AppState>
	) {
	}
}
