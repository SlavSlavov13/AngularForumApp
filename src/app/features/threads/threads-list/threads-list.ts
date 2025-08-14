import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Thread} from "../../../shared/models";
import {ThreadService} from "../../../core/services/thread.service";

@Component({
	selector: 'app-threads-list',
	imports: [
		RouterLink
	],
	templateUrl: './threads-list.html',
	styleUrl: './threads-list.css'
})
export class ThreadsList implements OnInit {
	threads: Thread[] | null = null;

	constructor(private threadService: ThreadService) {
	}

	async ngOnInit() {
		this.threads = await this.threadService.listThreads();
	}
}
