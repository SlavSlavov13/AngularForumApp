import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {AppUserModel, ThreadModel} from '../../../shared/models';
import {ThreadService} from '../../../core/services/thread.service';
import {AuthService} from "../../../core/services/auth.service";
import {AsyncPipe} from "@angular/common";

@Component({
	selector: 'app-thread-details',
	standalone: true,
	imports: [RouterLink, AsyncPipe],
	templateUrl: './thread-details.html',
	styleUrl: './thread-details.css'
})
export class ThreadDetails implements OnInit {
	thread!: ThreadModel;
	author!: AppUserModel;
	currentUid: Promise<string | null> = this.authService.currentUid()

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private threadService: ThreadService,
		private authService: AuthService
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			const id: string = this.route.snapshot.paramMap.get('id')!;
			this.thread = await firstValueFrom(this.threadService.getThread(id));
			const authorUid: string = this.thread!.authorId;
			this.author = await this.authService.getUser(authorUid);
		} catch (e) {
			console.error('Failed to load thread', e);
		}
	}

	async delete(): Promise<void> {
		const ok: boolean = confirm(`Delete thread "${this.thread!.title}"? This cannot be undone.`);
		if (!ok) return;

		try {
			this.threadService.deleteThread(this.thread!.id);
			await this.router.navigate(['/threads']);
		} catch (e) {
			console.error('Failed to delete thread', e);
			alert('Failed to delete thread. Please try again.');
		}
	}
}
