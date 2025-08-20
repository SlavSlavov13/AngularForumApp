import {TestBed} from '@angular/core/testing';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {guestGuard} from './guest-guard';
import {AuthService} from '../services/auth.service';

describe('guestGuard', () => {
	let authServiceMock: jasmine.SpyObj<AuthService>;
	let routerMock: jasmine.SpyObj<Router>;
	let routeSnapshot: ActivatedRouteSnapshot;
	let stateSnapshot: RouterStateSnapshot;

	beforeEach(() => {
		authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
		routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);

		routerMock.createUrlTree.and.callFake(() => ({} as UrlTree));

		TestBed.configureTestingModule({
			providers: [
				{provide: AuthService, useValue: authServiceMock},
				{provide: Router, useValue: routerMock},
			],
		});

		routeSnapshot = {} as ActivatedRouteSnapshot;
		stateSnapshot = {url: '/some-url'} as RouterStateSnapshot;
	});

	async function runGuard() {
		return TestBed.runInInjectionContext(() => guestGuard(routeSnapshot, stateSnapshot));
	}

	it('should allow navigation if user is not logged in', async () => {
		authServiceMock.isLoggedIn.and.returnValue(Promise.resolve(false));
		const result = await runGuard();
		expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
		expect(result).toBeTrue();
	});

	it('should redirect to /threads if user is logged in', async () => {
		authServiceMock.isLoggedIn.and.returnValue(Promise.resolve(true));
		const result = await runGuard();
		expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
		expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/threads']);
		expect(result).toEqual({} as UrlTree);
	});
});
