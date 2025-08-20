import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function trimmedMinLength(minLength: number): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value: string = control.value;
		if (value.trim().length < minLength) {
			return {minlength: {requiredLength: minLength, actualLength: value.trim().length}};
		}
		return null;
	};
}
