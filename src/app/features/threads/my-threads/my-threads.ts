import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ProfileThreadsList} from '../profile-threads-list/profile-threads-list';
import {AuthService} from '../../../core/services/auth.service';

@Component({
	selector: 'app-my-threads',
	standalone: true,
	imports: [ProfileThreadsList, AsyncPipe],
	templateUrl: './my-threads.html',
	styleUrl: './my-threads.css'
})
export class MyThreads {
	private auth = inject(AuthService);

	initialized$ = this.auth.initialized$;
	uid$: Observable<string | null> = this.auth.user$.pipe(
		map(u => u?.uid ?? null)
	);
}
