import {Component, Input} from '@angular/core';
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
export class ProfileThreadsList {
	threads$: Observable<ThreadModel[] | null> = new Observable<ThreadModel[] | null>();
	private _uid!: string;

	@Input({required: true})
	set uid(value: string) {
		this._uid = value;
		if (this._uid) {
			this.threads$ = this.threadService.listThreadsByUser(this._uid);
		}
	}

	get uid(): string {
		return this._uid;
	}

	constructor(protected threadService: ThreadService) {
	}
}
