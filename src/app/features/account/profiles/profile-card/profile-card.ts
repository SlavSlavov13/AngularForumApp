import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppUserModel} from '../../../../shared/models';
import {MyThreads} from "../../../threads/my-threads/my-threads";
import {AuthService} from "../../../../core/services/auth.service";
import {UserThreads} from "../../../threads/user-threads/user-threads";

@Component({
	selector: 'app-profile-card',
	standalone: true,
	imports: [CommonModule, MyThreads, UserThreads],
	templateUrl: './profile-card.html',
	styleUrl: './profile-card.css'
})
export class ProfileCard implements OnInit {
	showThreads = signal(false);
	currentUid: string | null = null;
	private auth = inject(AuthService);
	@Input() user!: AppUserModel; // required

	async ngOnInit(): Promise<void> {
		try {
			this.currentUid = await this.auth.currentUid();
		} catch (e) {
			console.error('Failed to load current user', e);
		}
	}

	toggleThreads(): void {
		this.showThreads.update(v => !v);
	}

}
