import {Component} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from './core/services/auth.service';
import {AsyncPipe} from '@angular/common';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterLink, RouterOutlet, AsyncPipe],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {
	error: string | null = null;
	signingOut: boolean = false;

	constructor(protected authService: AuthService, private router: Router) {
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
