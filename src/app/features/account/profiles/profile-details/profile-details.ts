import {Component, OnInit} from '@angular/core';
import {ProfileCard} from "../profile-card/profile-card";
import {AuthService} from "../../../../core/services/auth.service";
import {AppUserModel} from "../../../../shared/models";
import {ActivatedRoute} from "@angular/router";
import {handleError} from "../../../../shared/helpers";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../../store";
import {AsyncPipe} from "@angular/common";

@Component({
	selector: 'app-profile-details',
	imports: [ProfileCard, AsyncPipe],
	templateUrl: './profile-details.html',
	styleUrl: './profile-details.css'
})
export class ProfileDetails implements OnInit {
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	error: string | null = null;
	user!: AppUserModel;
	userLoaded: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private authService: AuthService,
		private store: Store<AppState>,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			const uid: string = this.route.snapshot.paramMap.get('id')!;
			this.user = await this.authService.getUser(uid);
			this.userLoaded = true;
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.store.dispatch(hideLoading());
		}
	}
}
