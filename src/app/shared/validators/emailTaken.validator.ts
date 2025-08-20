import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {AuthService} from "../../core/services/auth.service";

export function emailTakenValidator(
	authService: AuthService,
	currentEmail?: string,
): AsyncValidatorFn {
	return (control: AbstractControl): Promise<ValidationErrors | null> => {
		if (!control.value) {
			return Promise.resolve(null);
		}
		if (currentEmail && currentEmail === control.value) {
			return Promise.resolve(null);
		}
		return authService.isEmailTaken(control.value)
			.then(isTaken => (isTaken ? {emailTaken: true} : null))
			.catch(() => null);
	};
}
