import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {EditProfile} from './edit-profile';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../../../core/services/auth.service';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Location} from '@angular/common';
import {of} from 'rxjs';

describe('EditProfile', () => {
	let component: EditProfile;
	let fixture: ComponentFixture<EditProfile>;
	let authServiceMock: any;
	let routerMock: any;
	let storeMock: any;
	let locationMock: any;

	beforeEach(async () => {
		authServiceMock = {
			currentUid: jasmine.createSpy('currentUid').and.returnValue(Promise.resolve('user123')),
			getUser: jasmine.createSpy('getUser').and.returnValue(Promise.resolve({
				uid: 'user123',
				email: 'test@example.com',
				displayName: 'Test User',
				photoURL: 'photoURL',
				location: null,
				createdAt: null,
				lastLogin: null,
			})),
			updateUser: jasmine.createSpy('updateUser').and.returnValue(Promise.resolve()),
		};

		routerMock = {
			navigateByUrl: jasmine.createSpy('navigateByUrl').and.returnValue(Promise.resolve()),
		};

		storeMock = {
			dispatch: jasmine.createSpy('dispatch'),
			select: jasmine.createSpy('select').and.returnValue(of(true)),
		};

		locationMock = {
			back: jasmine.createSpy('back'),
		};

		await TestBed.configureTestingModule({
			imports: [EditProfile, ReactiveFormsModule],
			providers: [
				{provide: AuthService, useValue: authServiceMock},
				{provide: Router, useValue: routerMock},
				{provide: Store, useValue: storeMock},
				{provide: Location, useValue: locationMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(EditProfile);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize form with user data on ngOnInit', fakeAsync(() => {
		(component as any).ngOnInit();
		tick();

		const form = (component as any).form;
		expect(form.get('email').value).toBe('test@example.com');
		expect(form.get('displayName').value).toBe('Test User');
		expect(authServiceMock.getUser).toHaveBeenCalledWith('user123');
	}));

	it('should set saving true and call authService.updateUser on submit', fakeAsync(() => {
		// Set valid form values
		const form = (component as any).form;
		form.get('email').setValue('test@example.com');
		form.get('displayName').setValue('New Name');
		form.get('passwords.currentPassword').setValue('oldPass123');
		form.get('passwords.newPassword').setValue('newPass123');
		form.get('passwords.repeatNewPassword').setValue('newPass123');

		authServiceMock.updateUser.and.returnValue(Promise.resolve());

		(component as any).submit();

		expect((component as any).saving).toBeTrue();

		tick();

		expect(authServiceMock.updateUser).toHaveBeenCalled();
		expect(routerMock.navigateByUrl).toHaveBeenCalled();
		expect((component as any).saving).toBeFalse();
	}));

	it('should handle error and set error message on failed submit', fakeAsync(() => {
		(component as any).form.get('email').setValue('test@example.com');
		(component as any).form.get('displayName').setValue('New Name');
		(component as any).form.get('passwords.currentPassword').setValue('oldPass123');
		(component as any).form.get('passwords.newPassword').setValue('newPass123');
		(component as any).form.get('passwords.repeatNewPassword').setValue('newPass123');

		authServiceMock.updateUser.and.returnValue(Promise.reject('Error occurred'));

		(component as any).submit();

		tick();

		expect((component as any).error).toBeDefined();
		expect((component as any).saving).toBeFalse();
	}));

	it('should call location.back on onCancel', () => {
		(component as any).onCancel();
		expect(locationMock.back).toHaveBeenCalled();
	});
});
