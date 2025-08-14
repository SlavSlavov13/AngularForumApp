import {Component} from '@angular/core';
import {ProfileThreadsList} from "../profile-threads-list/profile-threads-list";

@Component({
	selector: 'app-user-threads',
	imports: [
		ProfileThreadsList
	],
	templateUrl: './user-threads.html',
	styleUrl: './user-threads.css'
})
export class UserThreads {

}
