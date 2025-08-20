import {trimmedMinLength} from './trimmed-min-length.validator';
import {FormControl} from '@angular/forms';

describe('trimmedMinLength', () => {
	const minLength = 3;
	const validator = trimmedMinLength(minLength);

	it('should return an error if value is not a string', () => {
		const control = new FormControl(123 as any);
		expect(validator(control)).toEqual({
			minlength: {requiredLength: minLength, actualLength: 0},
		});
	});

	it('should return an error if trimmed length is less than minLength', () => {
		const control = new FormControl('  a ');
		expect(validator(control)).toEqual({
			minlength: {requiredLength: minLength, actualLength: 1},
		});
	});

	it('should return null if trimmed length is equal or greater than minLength', () => {
		const control = new FormControl(' abc ');
		expect(validator(control)).toBeNull();
	});

	it('should return null for empty string', () => {
		const control = new FormControl('');
		expect(validator(control)).toBeNull();
	});
});
