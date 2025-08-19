import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProfileThreadsList} from '../profile-threads-list/profile-threads-list';
import {AuthService} from '../../../core/services/auth.service';
import {CommonModule} from "@angular/common";
import {handleError} from "../../../shared/helpers";
import {Observable} from "rxjs";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../store";
import {Store} from "@ngrx/store";


@Component({
	selector: 'app-my-threads',
	standalone: true,
	imports: [ProfileThreadsList, CommonModule],
	templateUrl: './my-threads.html',
	styleUrls: ['./my-threads.css']
})
export class MyThreads implements OnInit {
	uid!: string;
	error: string | null = null;
	loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	userLoaded: boolean = false;
	@Output() loadingChange: EventEmitter<void> = new EventEmitter<void>();
	@Input() profileCard: boolean = false;

	constructor(
		protected authService: AuthService,
		private store: Store<AppState>,
		private cdr: ChangeDetectorRef,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());
			this.loadingChange.emit();
			this.uid = (await this.authService.currentUid())!;
			this.userLoaded = true;
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.store.dispatch(hideLoading());
		}
	}

	onChildLoadingChange(): void {
		this.loadingChange.emit();
		this.cdr.detectChanges();
	}
}
