import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../core/services/auth.service';
import {AppUserModel} from '../../../../shared/models';
import {ProfileCard} from "../profile-card/profile-card";
import {handleError} from "../../../../shared/helpers";
import {Observable} from "rxjs";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../../store";
import {Store} from "@ngrx/store";
import {AsyncPipe} from "@angular/common";

@Component({
	selector: 'app-my-profile',
	standalone: true,
	imports: [ProfileCard, AsyncPipe],
	templateUrl: './my-profile.html',
	styleUrl: './my-profile.css'
})
export class MyProfile implements OnInit {
	error: string | null = null;
	user!: AppUserModel;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	userLoaded: boolean = false;

	constructor(
		private authService: AuthService,
		private store: Store<AppState>,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			const uid: string = (await this.authService.currentUid())!;
			this.user = await this.authService.getUser(uid);
			this.userLoaded = true;
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.store.dispatch(hideLoading());
		}
	}

}
