import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ThreadPostsList} from './thread-posts-list';
import {PostService} from '../../../core/services/post.service';
import {AuthService} from '../../../core/services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppUserModel, PostModel} from '../../../shared/models';
import {of} from "rxjs";
import {Timestamp} from "@angular/fire/firestore";

describe('ThreadPostsList', () => {
	let component: ThreadPostsList;
	let fixture: ComponentFixture<ThreadPostsList>;
	let postServiceMock: any;
	let authServiceMock: any;
	let activatedRouteMock: any;
	let storeMock: any;

	const mockTimestamp = Timestamp.fromDate(new Date('2025-01-01T00:00:00Z'));


	const mockPosts: PostModel[] = [
		{
			id: 'post1',
			threadId: 'thread123',
			authorId: 'user1',
			body: 'Post 1 body content',
			createdAt: mockTimestamp,
		},
		{
			id: 'post2',
			threadId: 'thread123',
			authorId: 'user2',
			body: 'Post 2 body content',
			createdAt: mockTimestamp,
		},
	];

	const mockUsers: AppUserModel[] = [
		{uid: 'user1', displayName: 'User One', email: 'one@example.com'},
		{uid: 'user2', displayName: 'User Two', email: 'two@example.com'},
	];

	beforeEach(async () => {
		postServiceMock = {
			listPostsByThread: jasmine.createSpy('listPostsByThread').and.returnValue(Promise.resolve(mockPosts)),
		};

		authServiceMock = {
			currentUid: jasmine.createSpy('currentUid').and.returnValue(Promise.resolve('user123')),
			getUsersByIds: jasmine.createSpy('getUsersByIds').and.returnValue(Promise.resolve(mockUsers)),
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
		};

		await TestBed.configureTestingModule({
			imports: [ThreadPostsList],
			providers: [
				{provide: PostService, useValue: postServiceMock},
				{provide: AuthService, useValue: authServiceMock},
				{provide: ActivatedRoute, useValue: activatedRouteMock},
				{
					provide: Store, useValue: storeMock = {
						dispatch: jasmine.createSpy('dispatch'),
						select: jasmine.createSpy('select').and.returnValue(of(null)),
					}
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ThreadPostsList);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load posts with author names and set componentLoaded flag on ngOnInit', async () => {
		await (component as any).ngOnInit();

		fixture.detectChanges();

		expect(postServiceMock.listPostsByThread).toHaveBeenCalledWith('thread123');
		expect(authServiceMock.getUsersByIds).toHaveBeenCalledWith(['user1', 'user2']);

		expect((component as any).posts.length).toBe(2);
		expect((component as any).posts[0].authorName).toBe('User One');
		expect((component as any).componentLoaded).toBeTrue();
		expect((component as any).error).toBeNull();
	});


	it('should set error and handleLoaded on ngOnInit failure', async () => {
		postServiceMock.listPostsByThread.and.returnValue(Promise.reject('Error'));

		await (component as any).ngOnInit();

		fixture.detectChanges();

		expect((component as any).error).toBeDefined();
	});


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

		// Call again; no additional dispatch
		storeMock.dispatch.calls.reset();
		(component as any).handleLoaded();
		expect(storeMock.dispatch).not.toHaveBeenCalled();
	});

});
