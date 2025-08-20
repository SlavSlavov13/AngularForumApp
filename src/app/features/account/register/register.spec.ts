import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Register} from './register';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {Router} from '@angular/router';

describe('Register', () => {
	let component: Register;
	let fixture: ComponentFixture<Register>;
	let authServiceMock: any;
	let routerMock: any;

	beforeEach(async () => {
		authServiceMock = {
			register: jasmine.createSpy('register'),
		};

		routerMock = {
			navigateByUrl: jasmine.createSpy('navigateByUrl'),
		};

		await TestBed.configureTestingModule({
			imports: [Register, ReactiveFormsModule],
			providers: [
				{provide: AuthService, useValue: authServiceMock},
				{provide: Router, useValue: routerMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(Register);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('form invalid when empty', () => {
		expect((component as any).form.valid).toBeFalse();
	});

	it('should invalidate passwords group when passwords do not match', () => {
		const passwordsGroup = (component as any).form.get('passwords');
		passwordsGroup?.setValue({password: 'secret1', repeat: 'secret2'});
		expect(passwordsGroup?.valid).toBeFalse();
		expect(passwordsGroup?.errors).toEqual({noMatch: true});
	});

	it('should validate passwords group when passwords match', () => {
		const passwordsGroup = (component as any).form.get('passwords');
		passwordsGroup?.setValue({password: 'secret1', repeat: 'secret1'});
		expect(passwordsGroup?.valid).toBeTrue();
	});

	it('should set saving true and call authService.register on valid submit', fakeAsync(() => {
		(component as any).form.controls['email'].setValue('test@example.com');
		(component as any).form.controls['displayName'].setValue('username');
		const passwordsGroup = (component as any).form.get('passwords');
		passwordsGroup?.setValue({password: 'password123', repeat: 'password123'});

		authServiceMock.register.and.returnValue(Promise.resolve());

		(component as any).submit();

		expect((component as any).saving).toBeTrue();

		tick();

		expect(authServiceMock.register).toHaveBeenCalledWith('test@example.com', 'password123', 'username');
		expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/threads');
		expect((component as any).saving).toBeFalse();
	}));

	it('should set error message if register fails', fakeAsync(() => {
		(component as any).form.controls['email'].setValue('test@example.com');
		(component as any).form.controls['displayName'].setValue('username');
		const passwordsGroup = (component as any).form.get('passwords');
		passwordsGroup?.setValue({password: 'password123', repeat: 'password123'});

		authServiceMock.register.and.returnValue(Promise.reject('Register error'));

		(component as any).submit();

		tick();

		expect((component as any).error).toBeDefined();
		expect((component as any).saving).toBeFalse();
	}));

	it('should mark all as touched and not submit if form invalid or already saving', () => {
		spyOn((component as any).form, 'markAllAsTouched');

		(component as any).saving = true;
		(component as any).submit();
		expect((component as any).form.markAllAsTouched).not.toHaveBeenCalled();

		(component as any).saving = false;
		(component as any).form.controls['email'].setValue('');
		(component as any).form.controls['displayName'].setValue('');
		const passwordsGroup = (component as any).form.get('passwords');
		passwordsGroup?.setValue({password: '', repeat: ''});

		(component as any).submit();
		expect((component as any).form.markAllAsTouched).toHaveBeenCalled();
	});
});
