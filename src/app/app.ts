import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from "./core/services/auth.service";

@Component({
	selector: 'app-root',
	imports: [RouterLink, RouterOutlet],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {
	protected readonly title = signal('forum');

	private auth = inject(AuthService);
	private router = inject(Router);

	async logout() {
		try {
			await this.auth.logout();             // calls signOut(this.auth)[4]
			await this.router.navigate(['/login']); // optional redirect after logout
		} catch (e) {
			console.error('Sign out error:', e);  // useful for debugging
		}
	}
}
