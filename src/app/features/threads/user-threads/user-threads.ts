import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProfileThreadsList} from '../profile-threads-list/profile-threads-list';
import {AuthService} from "../../../core/services/auth.service";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState, selectLoadingVisible} from "../../../store";
import {AsyncPipe} from "@angular/common";

@Component({
	selector: 'app-user-threads',
	standalone: true,
	imports: [ProfileThreadsList, AsyncPipe],
	templateUrl: './user-threads.html',
	styleUrl: './user-threads.css'
})
export class UserThreads implements OnInit {
	uid!: string;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	@Input() profileCard: boolean = false;
	@Output() loadingChange: EventEmitter<void> = new EventEmitter<void>();

	constructor(
		private route: ActivatedRoute,
		protected authService: AuthService,
		private store: Store<AppState>,
		private cdr: ChangeDetectorRef,
	) {
	}

	ngOnInit(): void {
		this.uid = this.route.snapshot.paramMap.get('uid')!;
	}

	onChildLoadingChange(): void {
		this.loadingChange.emit();
		this.cdr.detectChanges();
	}
}
