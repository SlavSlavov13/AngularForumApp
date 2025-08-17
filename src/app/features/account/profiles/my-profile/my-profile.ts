import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../core/services/auth.service';
import {AppUserModel} from '../../../../shared/models';
import {EditProfile} from "../edit-profile/edit-profile";

@Component({
	selector: 'app-my-profile',
	standalone: true,
	imports: [EditProfile],
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
			this.error = (e as Error)?.message || 'Failed to load profile.';
		} finally {
			this.loading = false;
		}
	}

}
