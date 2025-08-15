import {Component, inject, signal, WritableSignal} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from './core/services/auth.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterLink, RouterOutlet, AsyncPipe],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {
	protected readonly title: WritableSignal<string> = signal('forum');

	private auth = inject(AuthService);
	private router = inject(Router);

	initialized$: Observable<boolean> = this.auth.initialized$;
	loggedIn$: Observable<boolean> = this.auth.loggedIn$;

	// UI-only signal to show logout progress
	signingOut = signal(false);

	async logout(): Promise<void> {
		try {
			this.signingOut.set(true);
			await this.auth.logout();
			await this.router.navigate(['/threads']);
		} catch (e) {
			console.error('Sign out error:', e);
		} finally {
			this.signingOut.set(false);
		}
	}
}
