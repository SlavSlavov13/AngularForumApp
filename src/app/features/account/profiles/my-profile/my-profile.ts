import {Component} from '@angular/core';
import {ProfileCard} from "../profile-card/profile-card";

@Component({
	selector: 'app-my-profile',
	imports: [
		ProfileCard
	],
	templateUrl: './my-profile.html',
	styleUrl: './my-profile.css'
})
export class MyProfile {

}
