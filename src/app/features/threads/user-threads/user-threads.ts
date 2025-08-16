import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProfileThreadsList} from '../profile-threads-list/profile-threads-list';
import {AuthService} from "../../../core/services/auth.service";

@Component({
	selector: 'app-user-threads',
	standalone: true,
	imports: [ProfileThreadsList],
	templateUrl: './user-threads.html',
	styleUrl: './user-threads.css'
})
export class UserThreads implements OnInit {
	uid!: string;
	loading: boolean = true;
	@Input() profileCard: boolean = false;

	constructor(
		private route: ActivatedRoute,
		protected authService: AuthService,
	) {
	}

	ngOnInit(): void {
		this.uid = this.route.snapshot.paramMap.get('id')!;
		this.loading = false;
	}
}
