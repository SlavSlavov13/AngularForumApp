import {Component, OnInit} from '@angular/core';
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
	loading: boolean = true;
	error: string | null = null;
	user!: AppUserModel;

	constructor(private authService: AuthService) {
	}

	async ngOnInit(): Promise<void> {
		try {
			const uid: string = (await this.authService.currentUid())!;
			this.user = await this.authService.getUser(uid);
		} catch (e) {
			console.error('Failed to load profile', e);
			this.error = 'Failed to load profile.';
		} finally {
			this.loading = false;
		}
	}

}
