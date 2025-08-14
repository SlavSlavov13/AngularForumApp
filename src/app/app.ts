import {Component, computed, inject, Signal, signal, WritableSignal} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from "./core/services/auth.service";

@Component({
	selector: 'app-root',
	imports: [RouterLink, RouterOutlet],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {
	protected readonly title: WritableSignal<string> = signal('forum');
	private auth: AuthService = inject(AuthService);
	protected loggedIn: Signal<boolean> = computed((): boolean => this.auth.isLoggedIn());
	private router: Router = inject(Router);

	async logout() {
		try {
			await this.auth.logout();
			await this.router.navigate(['/threads']);
		} catch (e) {
			console.error('Sign out error:', e);
		}
	}
}
