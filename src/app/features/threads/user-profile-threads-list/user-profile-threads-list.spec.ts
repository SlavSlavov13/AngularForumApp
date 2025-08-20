import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {UserProfileThreadsList} from './user-profile-threads-list';
import {AuthService} from '../../../core/services/auth.service';
import {ThreadService} from '../../../core/services/thread.service';
import {Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {AppUserModel, ThreadModel} from '../../../shared/models';

describe('UserProfileThreadsList', () => {
	let component: UserProfileThreadsList;
	let fixture: ComponentFixture<UserProfileThreadsList>;
	let authServiceMock: any;
	let threadServiceMock: any;
	let storeMock: any;
	let activatedRouteMock: any;

	const mockUser: AppUserModel = {
		uid: 'user123',
		email: 'user@example.com',
		displayName: 'Test User',
		photoURL: null,
		createdAt: undefined,
		lastLogin: undefined,
		location: null,
	};

	const mockThreads: ThreadModel[] = [
		{
			id: 'thread1',
			title: 'Thread One',
			body: 'Thread body 1',
			tags: [],
			authorId: 'user123',
			createdAt: {} as any,
			replyCount: 0,
		},
		{
			id: 'thread2',
			title: 'Thread Two',
			body: 'Thread body 2',
			tags: [],
			authorId: 'user123',
			createdAt: {} as any,
			replyCount: 5,
		},
	];

	beforeEach(async () => {
		authServiceMock = {
			currentUid: jasmine.createSpy('currentUid').and.returnValue(Promise.resolve('user123')),
			getUser: jasmine.createSpy('getUser').and.returnValue(Promise.resolve(mockUser)),
		};

		threadServiceMock = {
			listThreadsByUser: jasmine.createSpy('listThreadsByUser').and.returnValue(Promise.resolve(mockThreads)),
			getUserThreadsCount: jasmine.createSpy('getUserThreadsCount').and.returnValue(Promise.resolve(5)),
		};

		storeMock = {
			dispatch: jasmine.createSpy('dispatch'),
			select: jasmine.createSpy('select').and.returnValue(of(true)),
		};

		activatedRouteMock = {
			snapshot: {
				paramMap: {
					get: jasmine.createSpy('get').and.returnValue(null), // simulate my profile (no uid)
				},
			},
		};

		await TestBed.configureTestingModule({
			imports: [UserProfileThreadsList],
			providers: [
				{provide: AuthService, useValue: authServiceMock},
				{provide: ThreadService, useValue: threadServiceMock},
				{provide: Store, useValue: storeMock},
				{provide: ActivatedRoute, useValue: activatedRouteMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(UserProfileThreadsList);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load my profile threads and set flags on ngOnInit', fakeAsync(() => {
		(component as any).ngOnInit();
		tick();

		expect(storeMock.dispatch).toHaveBeenCalledTimes(2); // showLoading + hideLoading
		expect(authServiceMock.currentUid).toHaveBeenCalledTimes(2);
		expect(authServiceMock.getUser).toHaveBeenCalledWith('user123');
		expect(threadServiceMock.listThreadsByUser).toHaveBeenCalledWith('user123', 3);
		expect(threadServiceMock.getUserThreadsCount).toHaveBeenCalledWith('user123');

		expect((component as any).threads.length).toBe(2);
		expect((component as any).threadsLimited).toBeTrue();
		expect((component as any).myProfile).toBeTrue();
		expect((component as any).componentLoaded).toBeTrue();
		expect((component as any).error).toBeNull();
	}));

	it('should load another user\'s threads on ngOnInit when uid param present', fakeAsync(() => {
		activatedRouteMock.snapshot.paramMap.get.and.returnValue('otherUser');

		(component as any).ngOnInit();
		tick();

		expect(authServiceMock.currentUid).toHaveBeenCalledTimes(1); // only once for currentUid
		expect(authServiceMock.getUser).toHaveBeenCalledWith('otherUser');
		expect(threadServiceMock.listThreadsByUser).toHaveBeenCalledWith('otherUser', 3);
		expect(threadServiceMock.getUserThreadsCount).toHaveBeenCalledWith('otherUser');
		expect((component as any).myProfile).toBeFalse();
	}));

	it('should set error on ngOnInit failure', fakeAsync(() => {
		threadServiceMock.listThreadsByUser.and.returnValue(Promise.reject('Error'));

		(component as any).ngOnInit();
		tick();

		expect((component as any).error).toBeDefined();
		expect(storeMock.dispatch).toHaveBeenCalledTimes(2);
	}));

	it('should call handleLoaded on ngOnDestroy', () => {
		spyOn(component as any, 'handleLoaded');
		(component as any).ngOnDestroy();

		expect((component as any).handleLoaded).toHaveBeenCalled();
	});

	it('should dispatch hideLoading only once in handleLoaded', () => {
		(component as any).loadingHandled = false;
		(component as any).handleLoaded();

		expect(storeMock.dispatch).toHaveBeenCalledWith(jasmine.any(Object));
		expect((component as any).loadingHandled).toBeTrue();

		storeMock.dispatch.calls.reset();
		(component as any).handleLoaded();
		expect(storeMock.dispatch).not.toHaveBeenCalled();
	});
});
