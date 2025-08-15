import {Component, inject, Input, OnInit} from '@angular/core';
import {ThreadModel} from "../../../shared/models";
import {DatePipe} from "@angular/common";
import {ThreadService} from "../../../core/services/thread.service";
import {RouterLink} from "@angular/router";

@Component({
	selector: 'app-profile-threads-list',
	imports: [
		DatePipe,
		RouterLink
	],
	templateUrl: './profile-threads-list.html',
	styleUrl: './profile-threads-list.css'
})
export class ProfileThreadsList implements OnInit {
	@Input() uid: string | null = '';

	threads: ThreadModel[] | null = null;
	loading: boolean = true;
	error: string | null = null;

	private threadService: ThreadService = inject(ThreadService);

	async ngOnInit(): Promise<void> {
		try {
			(this.uid)
			if (!this.uid) {
				this.threads = [];
				this.loading = false;
				return;
			}
			this.threads = await this.threadService.listThreadsByUser(this.uid);
			this.loading = false;
		} catch (e) {
			(e);
			this.error = 'Failed to load threads.';
			this.loading = false;
		}
	}
}
