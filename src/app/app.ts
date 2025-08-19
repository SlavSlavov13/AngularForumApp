import {Component} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from './core/services/auth.service';
import {AsyncPipe} from '@angular/common';
import {Store} from "@ngrx/store";
import {AppState, selectLoadingVisible} from "./store";
import {Observable} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterLink, AsyncPipe, RouterOutlet],
	templateUrl: './app.html',
	styleUrls: ['./app.css'],
	animations: [
		trigger('fadeAnimation', [
			state('visible', style({opacity: 1})),
			state('fadeOut', style({opacity: 0})),
			transition('visible => fadeOut', [
				animate('1000ms ease-out')
			]),
			transition('fadeOut => visible', [
				animate('1000ms ease-in')
			]),
		])
	],
})
export class App {
	error: string | null = null;
	signingOut: boolean = false;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	initialized$: Observable<boolean> = this.authService.initialized$;

	animationState: 'visible' | 'fadeOut' = 'visible';

	constructor(
		protected authService: AuthService,
		private router: Router,
		private store: Store<AppState>,
	) {
	}

	async logout(): Promise<void> {
		try {
			if (this.signingOut) {
				return;
			}
			this.animationState = 'fadeOut';
			this.signingOut = true;

			await new Promise(resolve => setTimeout(resolve, 1000));

			await this.authService.logout();

			this.animationState = 'visible';

			await this.router.navigate(['/threads']);
		} catch (e) {
			this.error = (e as Error)?.message || 'Logout failed.';
			this.animationState = 'visible';
		} finally {
			this.signingOut = false;
		}
	}
}
