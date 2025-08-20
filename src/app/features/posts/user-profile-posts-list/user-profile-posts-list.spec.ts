import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {UserProfilePostsList} from './user-profile-posts-list';
import {PostService} from '../../../core/services/post.service';
import {AuthService} from '../../../core/services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {AppUserModel, PostModel} from '../../../shared/models';

describe('UserProfilePostsList', () => {
	let component: UserProfilePostsList;
	let fixture: ComponentFixture<UserProfilePostsList>;
	let postServiceMock: any;
	let authServiceMock: any;
	let activatedRouteMock: any;
	let storeMock: any;
	let loadingStateChangedSpy: jasmine.Spy;

	const mockUser: AppUserModel = {
		uid: 'user123',
		email: 'user@example.com',
		displayName: 'Test User',
		photoURL: null,
		createdAt: undefined,
		lastLogin: undefined,
		location: null,
	};

	const mockPosts: PostModel[] = [
		{
			id: 'post1',
			threadId: 'thread1',
			authorId: 'user123',
			body: 'Post content 1',
			createdAt: {} as any,
		},
		{
			id: 'post2',
			threadId: 'thread2',
			authorId: 'user123',
			body: 'Post content 2',
			createdAt: {} as any,
		},
	];

	beforeEach(async () => {
		postServiceMock = {
			getUserPostsCount: jasmine.createSpy('getUserPostsCount').and.returnValue(Promise.resolve(5)),
			listPostsByUser: jasmine.createSpy('listPostsByUser').and.returnValue(Promise.resolve(mockPosts)),
		};

		authServiceMock = {
			currentUid: jasmine.createSpy('currentUid').and.returnValue(Promise.resolve('user123')),
			getUser: jasmine.createSpy('getUser').and.returnValue(Promise.resolve(mockUser)),
		};

		activatedRouteMock = {
			snapshot: {
				paramMap: {
					get: jasmine.createSpy('get').and.returnValue(null), // no uid param
				},
			},
		};

		storeMock = {
			dispatch: jasmine.createSpy('dispatch'),
			select: jasmine.createSpy('select').and.returnValue(of(true)),
		};

		await TestBed.configureTestingModule({
			imports: [UserProfilePostsList],
			providers: [
				{provide: PostService, useValue: postServiceMock},
				{provide: AuthService, useValue: authServiceMock},
				{provide: ActivatedRoute, useValue: activatedRouteMock},
				{provide: Store, useValue: storeMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(UserProfilePostsList);
		component = fixture.componentInstance;
		loadingStateChangedSpy = spyOn(component.loadingStateChanged, 'emit');

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load data and set flags correctly on ngOnInit when no uid param', fakeAsync(() => {
		(component as any).ngOnInit();
		tick();

		expect(authServiceMock.getUser).toHaveBeenCalledWith('user123');
		expect(postServiceMock.getUserPostsCount).toHaveBeenCalledWith('user123');
		expect(postServiceMock.listPostsByUser).toHaveBeenCalledWith('user123', 3);
		expect(loadingStateChangedSpy).toHaveBeenCalled();

		expect((component as any).myProfile).toBeTrue();
		expect((component as any).posts.length).toBe(2);
		expect((component as any).postsLimited).toBeTrue();
		expect((component as any).componentLoaded).toBeTrue();
		expect((component as any).error).toBeNull();
	}));

	it('should load data correctly on ngOnInit when uid param provided', fakeAsync(() => {
		activatedRouteMock.snapshot.paramMap.get.and.returnValue('otherUserId');

		(component as any).ngOnInit();
		tick();

		expect(authServiceMock.getUser).toHaveBeenCalledWith('otherUserId');
		expect(postServiceMock.getUserPostsCount).toHaveBeenCalledWith('otherUserId');
		expect(postServiceMock.listPostsByUser).toHaveBeenCalledWith('otherUserId', 3);
	}));

	it('should set error on ngOnInit failure', fakeAsync(() => {
		postServiceMock.listPostsByUser.and.returnValue(Promise.reject('Error!'));

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
