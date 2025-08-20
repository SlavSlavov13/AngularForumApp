import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function trimmedMinLength(minLength: number): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;

		if (typeof value !== 'string') {
			return {minlength: {requiredLength: minLength, actualLength: 0}};
		}

		if (value.trim().length < minLength) {
			return {minlength: {requiredLength: minLength, actualLength: value.trim().length}};
		}
		return null;
	};
}
