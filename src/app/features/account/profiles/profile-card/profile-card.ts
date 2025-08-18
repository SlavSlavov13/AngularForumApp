import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppUserModel} from '../../../../shared/models';
import {MyThreads} from "../../../threads/my-threads/my-threads";
import {AuthService} from "../../../../core/services/auth.service";
import {UserThreads} from "../../../threads/user-threads/user-threads";
import {RouterLink} from "@angular/router";
import {PostsList} from "../../../posts/posts-list/posts-list";

@Component({
	selector: 'app-profile-card',
	standalone: true,
	imports: [CommonModule, MyThreads, UserThreads, RouterLink, PostsList],
	templateUrl: './profile-card.html',
	styleUrl: './profile-card.css'
})
export class ProfileCard implements OnInit {
	@Input({required: true}) user!: AppUserModel;
	loading: boolean = true;

	showThreads: boolean = false;
	showPosts: boolean = false;
	currentUid: string | null = null;

	constructor(protected authService: AuthService) {
	}

	async ngOnInit(): Promise<void> {
		this.currentUid = await this.authService.currentUid();
		this.loading = false;
	}

	toggleThreads(): void {
		this.showThreads = !this.showThreads;
	}

	togglePosts(): void {
		this.showPosts = !this.showPosts;
	}
}
