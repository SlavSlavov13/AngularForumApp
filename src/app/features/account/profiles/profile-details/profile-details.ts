import {Component, OnInit} from '@angular/core';
import {ProfileCard} from "../profile-card/profile-card";
import {AuthService} from "../../../../core/services/auth.service";
import {AppUserModel} from "../../../../shared/models";
import {ActivatedRoute} from "@angular/router";

@Component({
	selector: 'app-profile-details',
	imports: [ProfileCard],
	templateUrl: './profile-details.html',
	styleUrl: './profile-details.css'
})
export class ProfileDetails implements OnInit {
	loading: boolean = true;
	error: string | null = null;
	user!: AppUserModel;

	constructor(private route: ActivatedRoute, private authService: AuthService) {
	}

	async ngOnInit(): Promise<void> {
		try {
			const uid: string = this.route.snapshot.paramMap.get('id')!;
			this.user = await this.authService.getUser(uid);
		} catch (e) {
			this.error = (e as Error)?.message || 'Failed to load profile.';
		} finally {
			this.loading = false;
		}
	}

}
