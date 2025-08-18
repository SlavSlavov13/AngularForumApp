import {Component} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from './core/services/auth.service';
import {AsyncPipe} from '@angular/common';
import {Store} from "@ngrx/store";
import {AppState, selectLoadingVisible} from "./store";
import {Observable} from "rxjs";

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterLink, AsyncPipe, RouterOutlet],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {
	error: string | null = null;
	signingOut: boolean = false;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);


	constructor(
		protected authService: AuthService,
		private router: Router,
		private store: Store<AppState>
	) {
	}

	async logout(): Promise<void> {
		try {
			this.signingOut = true;
			await this.authService.logout();
			await this.router.navigate(['/threads']);
		} catch (e) {
			this.error = (e as Error)?.message || 'Logout failed.';
		} finally {
			this.signingOut = false;
		}
	}
}
