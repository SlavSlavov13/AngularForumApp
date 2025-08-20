import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ProfileDetails} from './profile-details';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';
import {Store} from '@ngrx/store';
import {AppUserModel} from '../../../../shared/models';

describe('ProfileDetails', () => {
	let component: ProfileDetails;
	let fixture: ComponentFixture<ProfileDetails>;
	let activatedRouteMock: any;
	let authServiceMock: any;
	let storeMock: any;
	const mockUser: AppUserModel = {
		uid: 'user123',
		email: 'user@example.com',
		displayName: 'Test User',
		photoURL: null,
		createdAt: undefined,
		lastLogin: undefined,
		location: null,
	};

	beforeEach(async () => {
		activatedRouteMock = {
			snapshot: {
				paramMap: {
					get: jasmine.createSpy('get').and.returnValue(null), // default no uid in params
				},
			},
		};

		authServiceMock = {
			currentUid: jasmine.createSpy('currentUid').and.returnValue(Promise.resolve('user123')),
			getUser: jasmine.createSpy('getUser').and.returnValue(Promise.resolve(mockUser)),
		};

		storeMock = {
			dispatch: jasmine.createSpy('dispatch'),
		};

		await TestBed.configureTestingModule({
			imports: [ProfileDetails],
			providers: [
				{provide: ActivatedRoute, useValue: activatedRouteMock},
				{provide: AuthService, useValue: authServiceMock},
				{provide: Store, useValue: storeMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ProfileDetails);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load user data on ngOnInit when uid param is missing', fakeAsync(() => {
		(component as any).ngOnInit();
		tick();

		expect(activatedRouteMock.snapshot.paramMap.get).toHaveBeenCalledWith('uid');
		expect(authServiceMock.currentUid).toHaveBeenCalled();
		expect(authServiceMock.getUser).toHaveBeenCalledWith('user123');
		expect((component as any).user).toEqual(mockUser);
		expect((component as any).myProfile).toBeTrue();
		expect((component as any).componentLoaded).toBeTrue();
	}));

	it('should handle error in ngOnInit gracefully', fakeAsync(() => {
		authServiceMock.getUser.and.returnValue(Promise.reject('Error'));

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
		expect(storeMock.dispatch).toHaveBeenCalledWith(jasmine.any(Object)); // hideLoading
		expect((component as any).loadingHandled).toBeTrue();

		// Call again, no second dispatch
		storeMock.dispatch.calls.reset();
		(component as any).handleLoaded();
		expect(storeMock.dispatch).not.toHaveBeenCalled();
	});
});
