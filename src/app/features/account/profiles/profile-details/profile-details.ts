import {Component, inject} from '@angular/core';
import {ProfileCard} from "../profile-card/profile-card";
import {AuthService} from "../../../../core/services/auth.service";
import {AppUserModel} from "../../../../shared/models";
import {ActivatedRoute} from "@angular/router";

@Component({
	selector: 'app-profile-details',
	imports: [
		ProfileCard
	],
	templateUrl: './profile-details.html',
	styleUrl: './profile-details.css'
})
export class ProfileDetails {
	private route = inject(ActivatedRoute);
	private auth = inject(AuthService);
	loading = true;
	error: string | null = null;
	user: AppUserModel | null = null;

	async ngOnInit(): Promise<void> {

		try {
			const uid: string = this.route.snapshot.paramMap.get('id')!;
			this.user = await this.auth.getUser(uid);
		} catch (e) {
			console.error('Failed to profile', e);
			this.error = 'Failed to load profile.';
		} finally {
			this.loading = false;
		}
	}
}
