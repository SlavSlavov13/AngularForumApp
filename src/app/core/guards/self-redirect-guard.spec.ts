import {TestBed} from '@angular/core/testing';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {selfRedirectGuard} from './self-redirect-guard';
import {AuthService} from '../services/auth.service';

describe('selfRedirectGuard', () => {
	let authServiceMock: jasmine.SpyObj<AuthService>;
	let routerMock: jasmine.SpyObj<Router>;
	let routeSnapshot: ActivatedRouteSnapshot;
	let stateSnapshot: RouterStateSnapshot;

	beforeEach(() => {
		authServiceMock = jasmine.createSpyObj('AuthService', ['currentUid']);
		routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);

		routerMock.createUrlTree.and.callFake(() => ({} as UrlTree));

		TestBed.configureTestingModule({
			providers: [
				{provide: AuthService, useValue: authServiceMock},
				{provide: Router, useValue: routerMock},
			],
		});

		routeSnapshot = {} as ActivatedRouteSnapshot;
		stateSnapshot = {url: ''} as RouterStateSnapshot;
	});

	async function runGuard() {
		return TestBed.runInInjectionContext(() => selfRedirectGuard(routeSnapshot, stateSnapshot));
	}

	it('should allow navigation if currentUid is null', async () => {
		authServiceMock.currentUid.and.returnValue(Promise.resolve(null));

		const result = await runGuard();

		expect(authServiceMock.currentUid).toHaveBeenCalled();
		expect(result).toBeTrue();
	});

	it('should redirect /profile/:myId to /my-profile', async () => {
		const myId = 'user123';
		authServiceMock.currentUid.and.returnValue(Promise.resolve(myId));
		stateSnapshot.url = `/profile/${myId}`;

		const result = await runGuard();

		expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/my-profile']);
		expect(result).toEqual({} as UrlTree);
	});

	it('should redirect /profile/:myId/threads to /my-profile/threads', async () => {
		const myId = 'user123';
		authServiceMock.currentUid.and.returnValue(Promise.resolve(myId));
		stateSnapshot.url = `/profile/${myId}/threads`;

		const result = await runGuard();

		expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/my-profile/threads']);
		expect(result).toEqual({} as UrlTree);
	});

	it('should redirect /profile/:myId/posts to /my-profile/posts', async () => {
		const myId = 'user123';
		authServiceMock.currentUid.and.returnValue(Promise.resolve(myId));
		stateSnapshot.url = `/profile/${myId}/posts`;

		const result = await runGuard();

		expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/my-profile/posts']);
		expect(result).toEqual({} as UrlTree);
	});

	it('should allow navigation for other URLs', async () => {
		const myId = 'user123';
		authServiceMock.currentUid.and.returnValue(Promise.resolve(myId));
		stateSnapshot.url = `/profile/otherUser`;

		const result = await runGuard();

		expect(result).toBeTrue();
	});

	it('should correctly ignore query params and fragments in URL', async () => {
		const myId = 'user123';
		authServiceMock.currentUid.and.returnValue(Promise.resolve(myId));
		// URL includes query params and fragment
		stateSnapshot.url = `/profile/${myId}/posts?query=param#section`;

		const result = await runGuard();

		expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/my-profile/posts']);
		expect(result).toEqual({} as UrlTree);
	});
});
