import {Component, Input, OnInit} from '@angular/core';
import {ProfileThreadsList} from '../profile-threads-list/profile-threads-list';
import {AuthService} from '../../../core/services/auth.service';
import {CommonModule} from "@angular/common";


@Component({
	selector: 'app-my-threads',
	standalone: true,
	imports: [ProfileThreadsList, CommonModule],
	templateUrl: './my-threads.html',
	styleUrls: ['./my-threads.css']
})
export class MyThreads implements OnInit {
	uid!: string;
	loading: boolean = true;
	error: string | null = null;


	constructor(protected authService: AuthService) {
	}

	@Input() profileCard: boolean = false;

	async ngOnInit(): Promise<void> {
		try {
			this.uid = (await this.authService.currentUid())!;
		} catch (e) {
			this.error = (e as Error)?.message || 'Failed to load user.';
		} finally {
			this.loading = false;
		}
	}
}
