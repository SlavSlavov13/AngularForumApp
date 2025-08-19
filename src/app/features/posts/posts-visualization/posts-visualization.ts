import {Component, Input} from '@angular/core';
import {AsyncPipe, DatePipe} from "@angular/common";
import {AppUserModel, PostModel} from "../../../shared/models";
import {Observable} from "rxjs";
import {AppState, selectLoadingVisible} from "../../../store";
import {Store} from "@ngrx/store";
import {RouterLink} from "@angular/router";

@Component({
	selector: 'app-posts-visualization',
	imports: [
		AsyncPipe,
		DatePipe,
		RouterLink
	],
	templateUrl: './posts-visualization.html',
	styleUrl: './posts-visualization.css'
})
export class PostsVisualization {
	@Input({required: true}) posts!: PostModel[];
	@Input({required: true}) error!: string | null;
	@Input() currentUid!: string | null | undefined;
	@Input() postsLimited?: boolean;
	@Input() postInThread?: boolean;
	@Input() profileCardUser?: AppUserModel;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);

	constructor(
		private store: Store<AppState>,
	) {
	}
}
