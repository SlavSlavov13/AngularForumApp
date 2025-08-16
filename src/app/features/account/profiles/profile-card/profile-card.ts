import {Component, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppUserModel} from '../../../../shared/models';
import {MyThreads} from "../../../threads/my-threads/my-threads";
import {AuthService} from "../../../../core/services/auth.service";
import {UserThreads} from "../../../threads/user-threads/user-threads";
import {RouterLink} from "@angular/router";

@Component({
	selector: 'app-profile-card',
	standalone: true,
	imports: [CommonModule, MyThreads, UserThreads, RouterLink],
	templateUrl: './profile-card.html',
	styleUrl: './profile-card.css'
})
export class ProfileCard implements OnInit {
	@Input({required: true}) user!: AppUserModel;

	showThreads: WritableSignal<boolean> = signal(false);
	currentUid: string | null = null;

	constructor(protected authService: AuthService) {
	}

	async ngOnInit(): Promise<void> {
		this.currentUid = await this.authService.currentUid();
	}

	toggleThreads(): void {
		this.showThreads.update(v => !v);
	}
}
