import {TestBed} from '@angular/core/testing';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {existsGuard} from './exists-guard';
import {AuthService} from '../services/auth.service';
import {ThreadService} from '../services/thread.service';
import {PostService} from '../services/post.service';

describe('existsGuard', () => {
	let authServiceMock: jasmine.SpyObj<AuthService>;
	let threadServiceMock: jasmine.SpyObj<ThreadService>;
	let postServiceMock: jasmine.SpyObj<PostService>;
	let routerMock: jasmine.SpyObj<Router>;
	let routeSnapshot: ActivatedRouteSnapshot;
	let stateSnapshot: RouterStateSnapshot;


	// Helper to mock ActivatedRouteSnapshot.paramMap properly
	function setParamMapGet(getFn: (key: string) => string | null) {
		spyOnProperty(routeSnapshot, 'paramMap', 'get').and.returnValue({
			get: getFn,
			getAll: () => [],
			has: () => false,
			keys: [],
		} as any);
	}

	beforeEach(() => {
		authServiceMock = jasmine.createSpyObj('AuthService', ['userExists']);
		threadServiceMock = jasmine.createSpyObj('ThreadService', ['threadExists']);
		postServiceMock = jasmine.createSpyObj('PostService', ['postExists']);
		routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);

		// Use empty object cast as UrlTree to fix TS error
		routerMock.createUrlTree.and.callFake(() => ({} as UrlTree));

		TestBed.configureTestingModule({
			providers: [
				{provide: AuthService, useValue: authServiceMock},
				{provide: ThreadService, useValue: threadServiceMock},
				{provide: PostService, useValue: postServiceMock},
				{provide: Router, useValue: routerMock},
			],
		});

		routeSnapshot = new ActivatedRouteSnapshot();
		stateSnapshot = {url: '/test-url'} as RouterStateSnapshot;
	});

	async function runGuard() {
		return TestBed.runInInjectionContext(() => existsGuard(routeSnapshot, stateSnapshot));
	}

	it('should redirect to /threads if no params provided', async () => {
		setParamMapGet(() => null);

		const result = await runGuard();
		expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/threads']);
		expect(result).toEqual({} as UrlTree);
	});

	it('should check user existence and redirect if not exists', async () => {
		setParamMapGet((key) => (key === 'uid' ? 'user123' : null));
		authServiceMock.userExists.and.returnValue(Promise.resolve(false));

		const result = await runGuard();

		expect(authServiceMock.userExists).toHaveBeenCalledWith('user123');
		expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/threads']);
		expect(result).toEqual({} as UrlTree);
	});

	it('should allow route if user exists', async () => {
		setParamMapGet((key) => (key === 'uid' ? 'user123' : null));
		authServiceMock.userExists.and.returnValue(Promise.resolve(true));

		const result = await runGuard();

		expect(authServiceMock.userExists).toHaveBeenCalledWith('user123');
		expect(result).toBeTrue();
	});

	it('should check thread existence and redirect if not exists', async () => {
		setParamMapGet((key) => (key === 'threadId' ? 'thread123' : null));
		threadServiceMock.threadExists.and.returnValue(Promise.resolve(false));

		const result = await runGuard();

		expect(threadServiceMock.threadExists).toHaveBeenCalledWith('thread123');
		expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/threads']);
		expect(result).toEqual({} as UrlTree);
	});

	it('should allow route if thread exists', async () => {
		setParamMapGet((key) => (key === 'threadId' ? 'thread123' : null));
		threadServiceMock.threadExists.and.returnValue(Promise.resolve(true));

		const result = await runGuard();

		expect(threadServiceMock.threadExists).toHaveBeenCalledWith('thread123');
		expect(result).toBeTrue();
	});

	it('should check post existence and redirect if not exists', async () => {
		setParamMapGet((key) => (key === 'postId' ? 'post123' : null));
		postServiceMock.postExists.and.returnValue(Promise.resolve(false));

		const result = await runGuard();

		expect(postServiceMock.postExists).toHaveBeenCalledWith('post123');
		expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/threads']);
		expect(result).toEqual({} as UrlTree);
	});

	it('should allow route if post exists', async () => {
		setParamMapGet((key) => (key === 'postId' ? 'post123' : null));
		postServiceMock.postExists.and.returnValue(Promise.resolve(true));

		const result = await runGuard();

		expect(postServiceMock.postExists).toHaveBeenCalledWith('post123');
		expect(result).toBeTrue();
	});
});
