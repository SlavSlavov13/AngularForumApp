import {fakeAsync, flush, TestBed, tick} from '@angular/core/testing';
import {App} from './app';
import {Router} from '@angular/router';
import {AuthService} from './core/services/auth.service';
import {Store} from '@ngrx/store';
import {of, Subject} from 'rxjs';

describe('App', () => {
	let fixture: any;
	let app: App;
	let authServiceMock: any;
	let routerMock: any;
	let storeMock: any;
	let loadingSubject: Subject<boolean>;

	beforeEach(async () => {
		loadingSubject = new Subject<boolean>();

		authServiceMock = {
			initialized$: of(true),
			logout: jasmine.createSpy('logout').and.returnValue(Promise.resolve()),
		};

		routerMock = {
			navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)),
		};

		storeMock = {
			select: jasmine.createSpy('select').and.returnValue(loadingSubject.asObservable()),
		};

		await TestBed.configureTestingModule({
			imports: [App],
			providers: [
				{provide: AuthService, useValue: authServiceMock},
				{provide: Router, useValue: routerMock},
				{provide: Store, useValue: storeMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(App);
		app = fixture.componentInstance;
	});

	it('should create the app', () => {
		expect(app).toBeTruthy();
	});

	it('should start with animationState "visible"', () => {
		expect(app.animationState).toBe('visible');
	});

	it('should update animationState to "visible" when loading$ emits false', () => {
		app.animationState = 'fadeOut';
		loadingSubject.next(false);
		expect(app.animationState).toBe('visible');
	});

	it('should unsubscribe from loading$ on ngOnDestroy', () => {
		spyOn(app['loadingSubscription'], 'unsubscribe');
		app.ngOnDestroy();
		expect(app['loadingSubscription'].unsubscribe).toHaveBeenCalled();
	});

	it('should return early from logout if signingOut is true', fakeAsync(() => {
		app.signingOut = true;
		app.logout();
		tick(1000);
		expect(authServiceMock.logout).not.toHaveBeenCalled();
		expect(routerMock.navigate).not.toHaveBeenCalled();
	}));

	it('should perform logout and navigate to /threads', fakeAsync(() => {
		app.signingOut = false;
		app.logout();
		expect(app.signingOut).toBeTrue();
		expect(app.animationState).toBe('fadeOut');

		tick(1000); // wait for timeout in logout()

		flush();

		expect(authServiceMock.logout).toHaveBeenCalled();
		expect(routerMock.navigate).toHaveBeenCalledWith(['/threads']);
		expect(app.signingOut).toBeFalse();
		expect(app.animationState).toBe('fadeOut'); // remains fadeOut until next loading update
	}));

	it('should handle errors during logout', fakeAsync(() => {
		const error = new Error('Logout failed');
		authServiceMock.logout.and.returnValue(Promise.reject(error));
		spyOn<any>(app, 'handleError').and.callThrough();

		app.logout();

		tick(1000);

		flush();

		expect(app.error).not.toBeNull();
		expect(app.signingOut).toBeFalse();
		expect(app.animationState).toBe('visible');
	}));
});
