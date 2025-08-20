import {FormBuilder, FormGroup} from '@angular/forms';
import {passwordsMatchAndSameAsOldValidator} from './passwords-match-and-same-as-old.validator';

describe('passwordsMatchAndSameAsOldValidator', () => {
	let fb: FormBuilder;
	let form: FormGroup;
	const minLength = 6;
	let validatorFn: ReturnType<typeof passwordsMatchAndSameAsOldValidator>;

	beforeEach(() => {
		fb = new FormBuilder();
		validatorFn = passwordsMatchAndSameAsOldValidator(minLength);
	});

	it('should return null if all fields are empty', () => {
		form = fb.group({
			currentPassword: [''],
			newPassword: [''],
			repeatNewPassword: [''],
		});

		expect(validatorFn(form)).toBeNull();
	});

	it('should return minlength error if newPassword or currentPassword is shorter than minLength', () => {
		form = fb.group({
			currentPassword: ['123'],
			newPassword: ['12345'],
			repeatNewPassword: ['12345'],
		});

		const errors = validatorFn(form);

		expect(errors).toEqual({
			minlength: {
				requiredLength: minLength,
				newPasswordLength: 5,
				currentPasswordLength: 3,
			},
		});
	});

	it('should return samePassword error if newPassword equals currentPassword and not empty', () => {
		form = fb.group({
			currentPassword: ['password123'],
			newPassword: ['password123'],
			repeatNewPassword: ['password123'],
		});

		const errors = validatorFn(form);

		expect(errors).toEqual({samePassword: true});
	});

	it('should return passwordMismatch if newPassword and repeatNewPassword do not match', () => {
		form = fb.group({
			currentPassword: ['password123'],
			newPassword: ['newpassword1'],
			repeatNewPassword: ['newpassword2'],
		});

		const errors = validatorFn(form);

		expect(errors).toEqual({passwordMismatch: true});
	});

	it('should return null if all validations pass', () => {
		form = fb.group({
			currentPassword: ['password123'],
			newPassword: ['newpassword1'],
			repeatNewPassword: ['newpassword1'],
		});

		expect(validatorFn(form)).toBeNull();
	});
});
