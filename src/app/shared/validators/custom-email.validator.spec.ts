import {FormControl} from '@angular/forms';
import {customEmailValidator} from "./custom-email.validator";

describe('customEmailValidator', () => {
	const validator = customEmailValidator();

	it('should return null for empty value', () => {
		const control = new FormControl('');
		expect(validator(control)).toBeNull();
	});

	it('should return null for valid email', () => {
		const control = new FormControl('test@example.com');
		expect(validator(control)).toBeNull();
	});

	it('should return email error for invalid email', () => {
		const control = new FormControl('invalid-email');
		expect(validator(control)).toEqual({email: {value: 'invalid-email'}});
	});
});
