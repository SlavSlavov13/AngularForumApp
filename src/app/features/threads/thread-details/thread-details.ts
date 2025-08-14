import {Component} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";

@Component({
	selector: 'app-thread-details',
	imports: [
		RouterLink
	],
	templateUrl: './thread-details.html',
	styleUrl: './thread-details.css'
})
export class ThreadDetails {
	constructor(private route: ActivatedRoute) {
	}
}
