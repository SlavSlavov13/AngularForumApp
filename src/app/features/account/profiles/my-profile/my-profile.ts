import {Component, inject, OnInit} from '@angular/core';
import {ProfileCard} from '../profile-card/profile-card';
import {AuthService} from '../../../../core/services/auth.service';
import {AppUserModel} from '../../../../shared/models';

@Component({
	selector: 'app-my-profile',
	standalone: true,
	imports: [ProfileCard],
	templateUrl: './my-profile.html',
	styleUrl: './my-profile.css'
})
export class MyProfile implements OnInit {
	private auth = inject(AuthService);

	loading = true;
	error: string | null = null;
	user: AppUserModel | null = null;

	async ngOnInit(): Promise<void> {
		try {
			const uid = await this.auth.currentUid();
			if (!uid) {
				this.user = null; // not logged in
				return;
			}
			this.user = await this.auth.getUser(uid);
		} catch (e) {
			console.error('Failed to load profile', e);
			this.error = 'Failed to load profile.';
		} finally {
			this.loading = false;
		}
	}
}
