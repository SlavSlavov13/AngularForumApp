import {Component, Input} from '@angular/core';
import {ThreadModel} from "../../../shared/models";
import {Observable} from "rxjs";
import {AppState, selectLoadingVisible} from "../../../store";
import {Store} from "@ngrx/store";
import {AsyncPipe} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
	selector: 'app-threads-visualization',
	imports: [
		AsyncPipe,
		RouterLink
	],
	templateUrl: './threads-visualization.html',
	styleUrl: './threads-visualization.css'
})
export class ThreadsVisualization {
	@Input({required: true}) threads!: ThreadModel[];
	@Input() error!: string | null;

	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);

	constructor(
		private store: Store<AppState>
	) {
	}
}
