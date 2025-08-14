import {Component} from '@angular/core';
import {ProfileCard} from "../profile-card/profile-card";

@Component({
	selector: 'app-profile-details',
	imports: [
		ProfileCard
	],
	templateUrl: './profile-details.html',
	styleUrl: './profile-details.css'
})
export class ProfileDetails {

}
