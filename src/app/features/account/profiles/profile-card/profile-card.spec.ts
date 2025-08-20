import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ProfileCard} from './profile-card';
import {Store} from '@ngrx/store';
import {AuthService} from '../../../../core/services/auth.service';
import {ChangeDetectorRef} from '@angular/core';
import {of} from 'rxjs';

describe('ProfileCard', () => {
	let component: ProfileCard;
	let fixture: ComponentFixture<ProfileCard>;
	let storeMock: any;
	let authServiceMock: any;
	let cdrMock: any;

	beforeEach(async () => {
		storeMock = {
			dispatch: jasmine.createSpy('dispatch'),
			select: jasmine.createSpy('select').and.returnValue(of(true)),
		};

		authServiceMock = {};

		cdrMock = {
			detectChanges: jasmine.createSpy('detectChanges'),
		};

		await TestBed.configureTestingModule({
			imports: [ProfileCard],
			providers: [
				{provide: Store, useValue: storeMock},
				{provide: AuthService, useValue: authServiceMock},
				{provide: ChangeDetectorRef, useValue: cdrMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ProfileCard);
		component = fixture.componentInstance;

		// Initialize required @Input properties
		component.user = {
			uid: 'user123',
			email: 'test@example.com',
			displayName: 'Test User',
			photoURL: null,
			location: null,
			createdAt: undefined,
			lastLogin: undefined,
		};
		component.error = null;

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should dispatch showLoading on ngOnInit and handle photoPending false', fakeAsync(() => {
		(component as any).user.photoURL = null; // no photo url
		(component as any).loadingHandled = false;

		(component as any).ngOnInit();
		tick();

		expect(storeMock.dispatch).toHaveBeenCalledWith(jasmine.any(Object)); // showLoading
		expect((component as any).photoPending).toBeFalse();
		expect((component as any).thisComponentLoaded).toBeTrue();
		expect(storeMock.dispatch).toHaveBeenCalledWith(jasmine.any(Object)); // hideLoading by handleLoaded
	}));

	it('should toggle showThreads boolean flag', () => {
		expect((component as any).showThreads).toBeFalse();
		(component as any).toggleThreads();
		expect((component as any).showThreads).toBeTrue();
		(component as any).toggleThreads();
		expect((component as any).showThreads).toBeFalse();
	});

	it('should toggle showPosts boolean flag', () => {
		expect((component as any).showPosts).toBeFalse();
		(component as any).togglePosts();
		expect((component as any).showPosts).toBeTrue();
		(component as any).togglePosts();
		expect((component as any).showPosts).toBeFalse();
	});

	it('should call detectChanges on cdr', () => {
		(component as any).detectChanges();
		expect(cdrMock.detectChanges).toHaveBeenCalled();
	});

	it('should call handleLoaded only once', () => {
		(component as any).loadingHandled = false;
		(component as any).handleLoaded();
		expect(storeMock.dispatch).toHaveBeenCalledWith(jasmine.any(Object)); // hideLoading
		expect((component as any).loadingHandled).toBeTrue();
		// Call again; should not dispatch second time
		storeMock.dispatch.calls.reset();
		(component as any).handleLoaded();
		expect(storeMock.dispatch).not.toHaveBeenCalled();
	});

	it('should call handleLoaded on ngOnDestroy', () => {
		spyOn(component as any, 'handleLoaded');
		(component as any).ngOnDestroy();
		expect((component as any).handleLoaded).toHaveBeenCalled();
	});

	it('should set photoPreviewUrl and updatePhoto on onPhotoSelected', () => {
		const file = new File([''], 'photo.jpg', {type: 'image/jpeg'});
		const event = {target: {files: [file]}} as unknown as Event;

		(component as any).onPhotoSelected(event);
		expect((component as any).photoFile).toBe(file);
		expect((component as any).photoPreviewUrl).toContain('blob:'); // URL.createObjectURL returns blob URL string
		expect((component as any).updatePhoto).toBeTrue();
	});

	it('should clear photo and set updatePhoto true on clearPhoto', () => {
		(component as any).photoPreviewUrl = 'someUrl';
		(component as any).photoFile = {} as File;
		(component as any).updatePhoto = false;

		(component as any).clearPhoto();

		expect((component as any).photoPreviewUrl).toBeNull();
		expect((component as any).photoFile).toBeNull();
		expect((component as any).updatePhoto).toBeTrue();
	});

	it('should clear location on clearLocation', () => {
		(component as any).location = {lat: 1, lng: 2};
		(component as any).clearLocation();
		expect((component as any).location).toBeNull();
	});
});
