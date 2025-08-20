import {FormBuilder, FormGroup} from '@angular/forms';
import {passwordMatchValidator} from "./password-match.validator";

describe('passwordMatchValidator', () => {
	let fb: FormBuilder;
	let form: FormGroup;

	beforeEach(() => {
		fb = new FormBuilder();
	});

	it('should return null when passwords match', () => {
		form = fb.group(
			{
				password: ['secret123'],
				repeat: ['secret123'],
			},
			{validators: passwordMatchValidator}
		);

		const errors = passwordMatchValidator(form);
		expect(errors).toBeNull();
	});

	it('should return { noMatch: true } when passwords do not match', () => {
		form = fb.group(
			{
				password: ['secret123'],
				repeat: ['different'],
			},
			{validators: passwordMatchValidator}
		);

		const errors = passwordMatchValidator(form);
		expect(errors).toEqual({noMatch: true});
	});

	it('should return null when either password or repeat is empty', () => {
		form = fb.group(
			{
				password: [''],
				repeat: [''],
			},
			{validators: passwordMatchValidator}
		);

		const errors = passwordMatchValidator(form);
		expect(errors).toBeNull();
	});
});
