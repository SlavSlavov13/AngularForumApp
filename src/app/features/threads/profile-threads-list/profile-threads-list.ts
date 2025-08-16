import {Component, Input, OnInit} from '@angular/core';
import {ThreadService} from '../../../core/services/thread.service';
import {AsyncPipe, DatePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Observable} from "rxjs";
import {ThreadModel} from "../../../shared/models";

@Component({
	selector: 'app-profile-threads-list',
	standalone: true,
	imports: [
		AsyncPipe,
		RouterLink,
		DatePipe
	],
	templateUrl: './profile-threads-list.html'
})
export class ProfileThreadsList implements OnInit {
	threads$: Observable<ThreadModel[] | null> = new Observable<ThreadModel[] | null>();
	limitCount: number = 3;
	@Input() profileCard: boolean = false;
	@Input({required: true}) uid!: string;

	constructor(protected threadService: ThreadService) {
	}

	ngOnInit(): void {
		if (this.profileCard) {
			this.threads$ = this.threadService.listThreadsByUser(this.uid, (this.limitCount + 1)); //we are adding 1 to the limit count to see if there are more threads than the limit to determine whether to show the 'View all threads' button.
		} else {
			this.threads$ = this.threadService.listThreadsByUser(this.uid);
		}
	}

}
