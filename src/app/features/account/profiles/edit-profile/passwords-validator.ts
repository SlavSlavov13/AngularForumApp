import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export const passwordsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	const group = control as FormGroup;
	const currentPassword: string = group.get('currentPassword')?.value;
	const newPassword: string = group.get('newPassword')?.value;

	if (!currentPassword && !newPassword) {
		return null;
	}

	if (
		(newPassword && newPassword.length < 6) ||
		(currentPassword && currentPassword.length < 6)
	) {
		return {passwordTooShort: true};
	}

	if (newPassword === currentPassword) {
		return {samePassword: true};
	}

	return null;
};
