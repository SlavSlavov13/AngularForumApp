import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AllThreadsList} from './all-threads-list';
import {ThreadService} from '../../../core/services/thread.service';
import {AuthService} from '../../../core/services/auth.service';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {AppUserModel, ThreadModel} from '../../../shared/models';

describe('AllThreadsList', () => {
	let component: AllThreadsList;
	let fixture: ComponentFixture<AllThreadsList>;
	let threadServiceMock: any;
	let authServiceMock: any;
	let storeMock: any;

	const mockThreads: ThreadModel[] = [
		{
			id: 'thread1',
			title: 'Thread 1',
			body: 'Body 1',
			tags: [],
			authorId: 'user1',
			createdAt: {} as any,
			replyCount: 0,
		},
		{
			id: 'thread2',
			title: 'Thread 2',
			body: 'Body 2',
			tags: [],
			authorId: 'user2',
			createdAt: {} as any,
			replyCount: 5,
		},
	];

	const mockUsers: AppUserModel[] = [
		{uid: 'user1', displayName: 'User One', email: 'one@example.com'},
		{uid: 'user2', displayName: 'User Two', email: 'two@example.com'},
	];

	beforeEach(async () => {
		threadServiceMock = {
			listThreads: jasmine.createSpy('listThreads').and.returnValue(Promise.resolve(mockThreads)),
		};

		authServiceMock = {
			getUsersByIds: jasmine.createSpy('getUsersByIds').and.returnValue(Promise.resolve(mockUsers)),
		};

		storeMock = {
			dispatch: jasmine.createSpy('dispatch'),
			select: jasmine.createSpy('select').and.returnValue(of(true)),
		};

		await TestBed.configureTestingModule({
			imports: [AllThreadsList],
			providers: [
				{provide: ThreadService, useValue: threadServiceMock},
				{provide: AuthService, useValue: authServiceMock},
				{provide: Store, useValue: storeMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AllThreadsList);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load threads with author names and set componentLoaded on ngOnInit', fakeAsync(() => {
		(component as any).ngOnInit();
		tick();

		expect(threadServiceMock.listThreads).toHaveBeenCalled();
		expect(authServiceMock.getUsersByIds).toHaveBeenCalledWith(['user1', 'user2']);

		expect((component as any).threads.length).toBe(2);
		expect((component as any).threads[0].authorName).toBe('User One');
		expect((component as any).componentLoaded).toBeTrue();
		expect((component as any).error).toBeNull();
	}));

	it('should set error message on ngOnInit failure', fakeAsync(() => {
		threadServiceMock.listThreads.and.returnValue(Promise.reject('Error'));

		(component as any).ngOnInit();
		tick();

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
