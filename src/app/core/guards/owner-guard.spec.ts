import {TestBed} from '@angular/core/testing';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {ownerGuard} from './owner-guard';
import {AuthService} from '../services/auth.service';
import {ThreadService} from '../services/thread.service';
import {PostService} from '../services/post.service';
import {PostModel, ThreadModel} from '../../shared/models';

describe('ownerGuard', () => {
	let authServiceMock: jasmine.SpyObj<AuthService>;
	let threadServiceMock: jasmine.SpyObj<ThreadService>;
	let postServiceMock: jasmine.SpyObj<PostService>;
	let routerMock: jasmine.SpyObj<Router>;
	let routeSnapshot: ActivatedRouteSnapshot;
	let stateSnapshot: RouterStateSnapshot;

	beforeEach(() => {
		authServiceMock = jasmine.createSpyObj('AuthService', ['currentUid']);
		threadServiceMock = jasmine.createSpyObj('ThreadService', ['getThread']);
		postServiceMock = jasmine.createSpyObj('PostService', ['getPost']);
		routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);

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
		return TestBed.runInInjectionContext(() => ownerGuard(routeSnapshot, stateSnapshot));
	}

	function mockParamMap(getFn: (key: string) => string | null) {
		spyOnProperty(routeSnapshot, 'paramMap', 'get').and.returnValue({
			get: getFn,
			getAll: () => [],
			has: () => false,
			keys: [],
		} as any);
	}

	it('should allow navigation when current user is thread author', async () => {
		const threadId = 'thread123';
		const currentUid = 'userX';
		const thread: ThreadModel = {authorId: currentUid} as ThreadModel;

		mockParamMap((key) => (key === 'threadId' ? threadId : null));
		authServiceMock.currentUid.and.returnValue(Promise.resolve(currentUid));
		threadServiceMock.getThread.and.returnValue(Promise.resolve(thread));

		const result = await runGuard();

		expect(authServiceMock.currentUid).toHaveBeenCalled();
		expect(threadServiceMock.getThread).toHaveBeenCalledWith(threadId);
		expect(result).toBeTrue();
	});

	it('should redirect if current user is not thread author', async () => {
		const threadId = 'thread123';
		const thread: ThreadModel = {authorId: 'otherUser'} as ThreadModel;

		mockParamMap((key) => (key === 'threadId' ? threadId : null));
		authServiceMock.currentUid.and.returnValue(Promise.resolve('userX'));
		threadServiceMock.getThread.and.returnValue(Promise.resolve(thread));

		const result = await runGuard();

		expect(routerMock.createUrlTree).toHaveBeenCalledWith([`/threads/${threadId}`]);
		expect(result).toEqual({} as UrlTree);
	});

	it('should allow navigation when current user is post author', async () => {
		const postId = 'post123';
		const currentUid = 'userX';
		const post: PostModel = {authorId: currentUid, threadId: 'threadA'} as PostModel;

		mockParamMap((key) => (key === 'postId' ? postId : null));
		authServiceMock.currentUid.and.returnValue(Promise.resolve(currentUid));
		postServiceMock.getPost.and.returnValue(Promise.resolve(post));

		const result = await runGuard();

		expect(authServiceMock.currentUid).toHaveBeenCalled();
		expect(postServiceMock.getPost).toHaveBeenCalledWith(postId);
		expect(result).toBeTrue();
	});

	it('should redirect if current user is not post author', async () => {
		const postId = 'post123';
		const post: PostModel = {authorId: 'otherUser', threadId: 'threadA'} as PostModel;

		mockParamMap((key) => (key === 'postId' ? postId : null));
		authServiceMock.currentUid.and.returnValue(Promise.resolve('userX'));
		postServiceMock.getPost.and.returnValue(Promise.resolve(post));

		const result = await runGuard();

		expect(routerMock.createUrlTree).toHaveBeenCalledWith([`/threads/${post.threadId}`]);
		expect(result).toEqual({} as UrlTree);
	});

	it('should redirect to /threads if neither threadId nor postId provided', async () => {
		mockParamMap(() => null);

		authServiceMock.currentUid.and.returnValue(Promise.resolve('userX'));

		const result = await runGuard();

		expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/threads']);
		expect(result).toEqual({} as UrlTree);
	});
});
