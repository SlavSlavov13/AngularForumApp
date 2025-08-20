import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Login} from './login';
import {ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';

describe('Login', () => {
	let component: Login;
	let fixture: ComponentFixture<Login>;
	let authServiceMock: any;
	let routerMock: any;
	let activatedRouteMock: any;

	beforeEach(async () => {
		authServiceMock = {
			login: jasmine.createSpy('login'),
		};

		routerMock = {
			navigateByUrl: jasmine.createSpy('navigateByUrl'),
		};

		activatedRouteMock = {
			snapshot: {
				queryParamMap: {
					get: jasmine.createSpy('get').and.returnValue(null), // default no returnUrl
				},
			},
		};

		await TestBed.configureTestingModule({
			imports: [Login, ReactiveFormsModule],
			providers: [
				{provide: AuthService, useValue: authServiceMock},
				{provide: Router, useValue: routerMock},
				{provide: ActivatedRoute, useValue: activatedRouteMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(Login);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('form invalid when empty', () => {
		expect((component as any).form.valid).toBeFalse();
	});

	it('form valid with correct email and password', () => {
		(component as any).form.controls['email'].setValue('test@example.com');
		(component as any).form.controls['password'].setValue('123456');
		expect((component as any).form.valid).toBeTrue();
	});

	it('should set loggingIn true during submit and call authService.login', fakeAsync(() => {
		(component as any).form.controls['email'].setValue('test@example.com');
		(component as any).form.controls['password'].setValue('password123');

		authServiceMock.login.and.returnValue(Promise.resolve());

		component.submit();
		expect((component as any).loggingIn).toBeTrue();

		tick(); // simulate async

		expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
		expect((component as any).loggingIn).toBeFalse();
	}));

	it('should navigate to returnUrl after successful login', fakeAsync(() => {
		const returnUrl = '/dashboard';
		activatedRouteMock.snapshot.queryParamMap.get.and.returnValue(returnUrl);
		(component as any).form.controls['email'].setValue('test@example.com');
		(component as any).form.controls['password'].setValue('password123');

		authServiceMock.login.and.returnValue(Promise.resolve());

		component.submit();

		tick();

		expect(routerMock.navigateByUrl).toHaveBeenCalledWith(returnUrl);
	}));

	it('should navigate to /threads if no returnUrl is set', fakeAsync(() => {
		activatedRouteMock.snapshot.queryParamMap.get.and.returnValue(null);
		(component as any).form.controls['email'].setValue('test@example.com');
		(component as any).form.controls['password'].setValue('password123');

		authServiceMock.login.and.returnValue(Promise.resolve());

		component.submit();

		tick();

		expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/threads');
	}));

	it('should set error message if login fails', fakeAsync(() => {
		(component as any).form.controls['email'].setValue('test@example.com');
		(component as any).form.controls['password'].setValue('password123');

		authServiceMock.login.and.returnValue(Promise.reject('Login error'));

		component.submit();

		tick();

		expect((component as any).error).toBeDefined();
		expect((component as any).loggingIn).toBeFalse();
	}));

	it('should mark all as touched and not submit if form invalid or already logging in', () => {
		spyOn((component as any).form, 'markAllAsTouched');

		(component as any).loggingIn = true;
		component.submit();
		expect((component as any).form.markAllAsTouched).toHaveBeenCalled();

		(component as any).loggingIn = false;
		(component as any).form.controls['email'].setValue('');
		(component as any).form.controls['password'].setValue('');

		component.submit();
		expect((component as any).form.markAllAsTouched).toHaveBeenCalled();
	});
});
