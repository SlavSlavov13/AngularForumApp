import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {combineLatest, Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {ProfileThreadsList} from '../profile-threads-list/profile-threads-list';
import {AuthService} from '../../../core/services/auth.service';

@Component({
	selector: 'app-user-threads',
	standalone: true,
	imports: [ProfileThreadsList, AsyncPipe],
	templateUrl: './user-threads.html',
	styleUrl: './user-threads.css'
})
export class UserThreads {
	private route = inject(ActivatedRoute);
	private auth = inject(AuthService);

	// Route uid (from /users/:id or similar)
	routeUid$: Observable<string> = this.route.paramMap.pipe(
		map(params => params.get('id')!),
		filter(id => !!id)
	);

	// Auth initialization flag from your service
	initialized$ = this.auth.initialized$;

	// View-model stream to drive the template (optional but tidy)
	// Emits { init: boolean, uid: string }
	vm$ = combineLatest([this.initialized$, this.routeUid$]).pipe(
		map(([init, uid]) => ({init, uid}))
	);
}
