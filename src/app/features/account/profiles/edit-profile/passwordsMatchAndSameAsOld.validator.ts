import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export function passwordsMatchAndSameAsOldValidator(minLength: number): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const group = control as FormGroup;
		let currentPassword: string = group.get('currentPassword')?.value ?? '';
		let newPassword: string = group.get('newPassword')?.value ?? '';
		let repeatNewPassword: string = group.get('repeatNewPassword')?.value ?? '';

		currentPassword = currentPassword.trim();
		newPassword = newPassword.trim();
		repeatNewPassword = repeatNewPassword.trim();

		if (!currentPassword && !newPassword && !repeatNewPassword) {
			return null;
		}

		if (
			(newPassword && newPassword.length < minLength) ||
			(currentPassword && currentPassword.length < minLength)
		) {
			return {
				minlength: {
					requiredLength: minLength,
					newPasswordLength: newPassword.length,
					currentPasswordLength: currentPassword.length
				}
			};
		}

		if (newPassword === currentPassword && newPassword !== '') {
			return {samePassword: true};
		}

		if (newPassword !== repeatNewPassword) {
			return {passwordMismatch: true};
		}

		return null;
	};
}
