import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {UserThreadsList} from './user-threads-list';
import {ThreadService} from '../../../core/services/thread.service';
import {AuthService} from '../../../core/services/auth.service';
import {Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {AppUserModel, ThreadModel} from '../../../shared/models';

describe('UserThreadsList', () => {
	let component: UserThreadsList;
	let fixture: ComponentFixture<UserThreadsList>;
	let threadServiceMock: any;
	let authServiceMock: any;
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
			body: 'Body of thread one',
			tags: [],
			authorId: 'user123',
			createdAt: {} as any,
			replyCount: 0,
		},
		{
			id: 'thread2',
			title: 'Thread Two',
			body: 'Body of thread two',
			tags: [],
			authorId: 'user123',
			createdAt: {} as any,
			replyCount: 3,
		},
	];

	beforeEach(async () => {
		threadServiceMock = {
			listThreadsByUser: jasmine.createSpy('listThreadsByUser').and.returnValue(Promise.resolve(mockThreads)),
		};

		authServiceMock = {
			currentUid: jasmine.createSpy('currentUid').and.returnValue(Promise.resolve('user123')),
			getUser: jasmine.createSpy('getUser').and.returnValue(Promise.resolve(mockUser)),
		};

		storeMock = {
			dispatch: jasmine.createSpy('dispatch'),
			select: jasmine.createSpy('select').and.returnValue(of(true)),
		};

		activatedRouteMock = {
			snapshot: {
				paramMap: {
					get: jasmine.createSpy('get').and.returnValue(null), // simulate my profile, no uid param
				},
			},
		};

		await TestBed.configureTestingModule({
			imports: [UserThreadsList],
			providers: [
				{provide: ThreadService, useValue: threadServiceMock},
				{provide: AuthService, useValue: authServiceMock},
				{provide: Store, useValue: storeMock},
				{provide: ActivatedRoute, useValue: activatedRouteMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(UserThreadsList);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load my profile threads and user on ngOnInit', fakeAsync(() => {
		(component as any).ngOnInit();
		tick();

		expect(authServiceMock.currentUid).toHaveBeenCalled();
		expect(authServiceMock.getUser).toHaveBeenCalledWith('user123');
		expect(threadServiceMock.listThreadsByUser).toHaveBeenCalledWith('user123');

		expect((component as any).myProfile).toBeTrue();
		expect((component as any).user).toEqual(mockUser);
		expect((component as any).threads.length).toBe(2);
		expect((component as any).componentLoaded).toBeTrue();
		expect((component as any).error).toBeNull();
	}));

	it('should set error on ngOnInit failure', fakeAsync(async () => {
		(component as any).ngOnInit();

		await threadServiceMock.listThreadsByUser.and.returnValue(Promise.reject('Error'));
		expect((component as any).error).toBeDefined();
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
