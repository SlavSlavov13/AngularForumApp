import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ThreadDetails} from './thread-details';
import {ThreadService} from '../../../core/services/thread.service';
import {AuthService} from '../../../core/services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Location} from '@angular/common';
import {Dialog} from '@angular/cdk/dialog';
import {of} from 'rxjs';
import {AppUserModel, ThreadModel} from '../../../shared/models';

describe('ThreadDetails', () => {
	let component: ThreadDetails;
	let fixture: ComponentFixture<ThreadDetails>;
	let threadServiceMock: any;
	let authServiceMock: any;
	let activatedRouteMock: any;
	let storeMock: any;
	let locationMock: any;
	let dialogMock: any;

	const mockThread: ThreadModel = {
		id: 'thread123',
		title: 'Test Thread',
		body: 'Body content',
		tags: ['tag1', 'tag2'],
		authorId: 'user123',
		createdAt: {} as any,
		replyCount: 0,
	};

	const mockAuthor: AppUserModel = {
		uid: 'user123',
		displayName: 'Author Name',
		email: 'author@example.com',
	};

	beforeEach(async () => {
		threadServiceMock = {
			getThread: jasmine.createSpy('getThread').and.returnValue(Promise.resolve(mockThread)),
			deleteThread: jasmine.createSpy('deleteThread').and.returnValue(Promise.resolve()),
		};

		authServiceMock = {
			getUser: jasmine.createSpy('getUser').and.returnValue(Promise.resolve(mockAuthor)),
			currentUid: jasmine.createSpy('currentUid').and.returnValue(Promise.resolve('user123')),
		};

		activatedRouteMock = {
			snapshot: {
				paramMap: {
					get: jasmine.createSpy('get').and.returnValue('thread123'),
				},
			},
		};

		storeMock = {
			dispatch: jasmine.createSpy('dispatch'),
			select: jasmine.createSpy('select').and.returnValue(of(true)),
		};

		locationMock = {
			back: jasmine.createSpy('back'),
		};

		dialogMock = {
			open: jasmine.createSpy('open'),
		};

		await TestBed.configureTestingModule({
			imports: [ThreadDetails],
			providers: [
				{provide: ThreadService, useValue: threadServiceMock},
				{provide: AuthService, useValue: authServiceMock},
				{provide: ActivatedRoute, useValue: activatedRouteMock},
				{provide: Store, useValue: storeMock},
				{provide: Location, useValue: locationMock},
				{provide: Dialog, useValue: dialogMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ThreadDetails);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load thread and author on ngOnInit', fakeAsync(() => {
		(component as any).ngOnInit();
		tick();

		expect(storeMock.dispatch).toHaveBeenCalledTimes(2); // showLoading + hideLoading
		expect(threadServiceMock.getThread).toHaveBeenCalledWith('thread123');
		expect(authServiceMock.getUser).toHaveBeenCalledWith('user123');
		expect((component as any).thread).toEqual(mockThread);
		expect((component as any).author).toEqual(mockAuthor);
		expect((component as any).tags).toBe('tag1, tag2');
	}));

	it('should handle error on ngOnInit failure', fakeAsync(() => {
		threadServiceMock.getThread.and.returnValue(Promise.reject('Error'));

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

	it('should delete thread if confirmed and call location.back', fakeAsync(() => {
		const dialogCloseSubject = of(true);
		dialogMock.open.and.returnValue({closed: dialogCloseSubject});
		(component as any).thread = mockThread;

		(component as any).delete();
		tick();

		expect(storeMock.dispatch).toHaveBeenCalledWith(jasmine.any(Object)); // showLoading
		expect(threadServiceMock.deleteThread).toHaveBeenCalledWith('thread123');
		expect(locationMock.back).toHaveBeenCalled();
	}));

	it('should not delete thread if confirmation rejected', fakeAsync(() => {
		const dialogCloseSubject = of(false);
		dialogMock.open.and.returnValue({closed: dialogCloseSubject});
		(component as any).thread = mockThread;

		(component as any).delete();
		tick();

		expect(threadServiceMock.deleteThread).not.toHaveBeenCalled();
		expect(locationMock.back).not.toHaveBeenCalled();
	}));

	it('should set error if delete fails', fakeAsync(() => {
		const dialogCloseSubject = of(true);
		dialogMock.open.and.returnValue({closed: dialogCloseSubject});
		threadServiceMock.deleteThread.and.returnValue(Promise.reject('Delete error'));
		(component as any).thread = mockThread;

		(component as any).delete();
		tick();

		expect((component as any).error).toBeDefined();
	}));
});
