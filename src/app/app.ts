import {Component, signal, WritableSignal} from '@angular/core';
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
	constructor(protected authService: AuthService, private router: Router) {
	}

	signingOut: WritableSignal<boolean> = signal(false);

	async logout(): Promise<void> {
		try {
			this.signingOut.set(true);
			await this.authService.logout();
			await this.router.navigate(['/threads']);
		} catch (e) {
			console.error('Sign out error:', e);
		} finally {
			this.signingOut.set(false);
		}
	}
}
