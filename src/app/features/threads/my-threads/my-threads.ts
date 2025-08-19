import {Component, Input, OnInit} from '@angular/core';
import {ProfileThreadsList} from '../profile-threads-list/profile-threads-list';
import {AuthService} from '../../../core/services/auth.service';
import {CommonModule} from "@angular/common";
import {handleError} from "../../../shared/helpers";
import {Observable} from "rxjs";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";
import {Store} from "@ngrx/store";


@Component({
	selector: 'app-my-threads',
	standalone: true,
	imports: [ProfileThreadsList, CommonModule],
	templateUrl: './my-threads.html',
	styleUrls: ['./my-threads.css']
})
export class MyThreads implements OnInit {
	uid!: string;
	error: string | null = null;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);

	constructor(
		protected authService: AuthService,
		private store: Store<AppState>,
	) {
	}

	@Input() profileCard: boolean = false;

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			this.uid = (await this.authService.currentUid())!;
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.store.dispatch(hideLoading());
		}
	}
}
