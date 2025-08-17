import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export const passwordsMatchAndSameAsOldValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	const group = control as FormGroup;
	const currentPassword: string = group.get('currentPassword')?.value;
	const newPassword: string = group.get('newPassword')?.value;
	const repeatNewPassword: string = group.get('repeatNewPassword')?.value;

	if (!currentPassword && !newPassword && !repeatNewPassword) {
		return null;
	}

	if (
		(newPassword && newPassword.length < 6) ||
		(currentPassword && currentPassword.length < 6)
	) {
		return {passwordTooShort: true};
	}

	if (newPassword === currentPassword && newPassword !== '') {
		return {samePassword: true};
	}

	if (newPassword !== repeatNewPassword) {
		return {passwordMismatch: true};
	}

	return null;
};
