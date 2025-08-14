import {Component} from '@angular/core';
import {ProfileThreadsList} from "../profile-threads-list/profile-threads-list";

@Component({
	selector: 'app-my-threads',
	imports: [
		ProfileThreadsList
	],
	templateUrl: './my-threads.html',
	styleUrl: './my-threads.css'
})
export class MyThreads {

}
