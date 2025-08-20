import {Component, OnDestroy} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from './core/services/auth.service';
import {AsyncPipe} from '@angular/common';
import {Store} from "@ngrx/store";
import {AppState, selectLoadingVisible} from "./store";
import {Observable, Subscription} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {handleError} from "./shared/helpers";

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
export class App implements OnDestroy {
	error: string | null = null;
	signingOut: boolean = false;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	initialized$: Observable<boolean> = this.authService.initialized$;
	private loadingSubscription: Subscription;
	animationState: 'visible' | 'fadeOut' = 'visible';

	constructor(
		protected authService: AuthService,
		private router: Router,
		private store: Store<AppState>,
	) {
		this.loadingSubscription = this.loading$.subscribe(isLoading => {
			if (!isLoading) {
				this.animationState = 'visible';
			}
		});
	}

	ngOnDestroy(): void {
		this.loadingSubscription.unsubscribe();
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
			await this.router.navigate(['/threads']);
		} catch (e) {
			this.error = handleError(e);
			this.animationState = 'visible';
		} finally {
			this.signingOut = false;
		}
	}
}
