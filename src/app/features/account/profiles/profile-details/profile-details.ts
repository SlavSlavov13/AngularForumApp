import {Component, OnInit} from '@angular/core';
import {ProfileCard} from "../profile-card/profile-card";
import {AuthService} from "../../../../core/services/auth.service";
import {AppUserModel} from "../../../../shared/models";
import {ActivatedRoute} from "@angular/router";
import {handleError} from "../../../../shared/helpers";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../../store";

@Component({
	selector: 'app-profile-details',
	imports: [ProfileCard],
	templateUrl: './profile-details.html',
	styleUrl: './profile-details.css'
})
export class ProfileDetails implements OnInit {
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	error: string | null = null;
	uid: string | null = null;
	user!: AppUserModel;
	componentLoaded: boolean = false;
	myProfile: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private authService: AuthService,
		private store: Store<AppState>,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			this.uid = this.route.snapshot.paramMap.get('uid');
			if (!this.uid) {
				this.uid = (await this.authService.currentUid())!;
				this.myProfile = true;
			}
			this.user = await this.authService.getUser(this.uid);
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.store.dispatch(hideLoading());
			this.componentLoaded = true;
		}
	}
}
