import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {AppUserModel, ThreadModel} from '../../../shared/models';
import {ThreadService} from '../../../core/services/thread.service';
import {AuthService} from "../../../core/services/auth.service";
import {AsyncPipe} from "@angular/common";
import {handleError} from "../../../shared/helpers";
import {PostsList} from "../../posts/posts-list/posts-list";

@Component({
	selector: 'app-thread-details',
	standalone: true,
	imports: [RouterLink, AsyncPipe, PostsList],
	templateUrl: './thread-details.html',
	styleUrl: './thread-details.css'
})
export class ThreadDetails implements OnInit {
	error: string | null = null;
	loading: boolean = true;
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
			this.error = handleError(e);
		} finally {
			this.loading = false;
		}
	}

	async delete(): Promise<void> {
		const ok: boolean = confirm(`Delete thread "${this.thread!.title}"? This cannot be undone.`);
		if (!ok) return;

		this.threadService.deleteThread(this.thread!.id).subscribe({
			error: (e): void => {
				this.error = handleError(e);
			}
		});
		await this.router.navigate(['/threads']);
		this.loading = false;
	}
}
