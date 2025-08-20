import {TestBed} from '@angular/core/testing';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {authGuard} from './auth-guard';
import {AuthService} from '../services/auth.service';

describe('authGuard', () => {
	let authServiceMock: any;
	let routerMock: any;
	let route: ActivatedRouteSnapshot;
	let state: RouterStateSnapshot;

	beforeEach(() => {
		authServiceMock = {
			isLoggedIn: jasmine.createSpy(),
		};

		routerMock = {
			createUrlTree: jasmine.createSpy().and.callFake((commands, extras) => {
				return {commands, extras} as unknown as UrlTree; // mock UrlTree
			}),
		};

		TestBed.configureTestingModule({
			providers: [
				{provide: AuthService, useValue: authServiceMock},
				{provide: Router, useValue: routerMock},
			],
		});

		route = {} as ActivatedRouteSnapshot;
		state = {url: '/some-url'} as RouterStateSnapshot;
	});

	function executeGuard() {
		return TestBed.runInInjectionContext(() => authGuard(route, state));
	}

	it('should allow navigation when user is logged in', async () => {
		authServiceMock.isLoggedIn.and.returnValue(Promise.resolve(true));
		const result = await executeGuard();
		expect(result).toBeTrue();
		expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
	});

	it('should redirect to /login with returnUrl when user is not logged in', async () => {
		authServiceMock.isLoggedIn.and.returnValue(Promise.resolve(false));
		const result = await executeGuard();
		expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login'], {queryParams: {returnUrl: state.url}});
		expect(result).toEqual(routerMock.createUrlTree());
	});
});
