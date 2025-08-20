import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {AuthService} from "../../core/services/auth.service";

export function displayNameTakenValidator(
	authService: AuthService,
	currentDisplayName?: string,
): AsyncValidatorFn {
	return (control: AbstractControl): Promise<ValidationErrors | null> => {
		if (!control.value) {
			return Promise.resolve(null);
		}
		if (currentDisplayName && currentDisplayName === control.value) {
			return Promise.resolve(null);
		}
		return authService.isDisplayNameTaken(control.value)
			.then(isTaken => (isTaken ? {displayNameTaken: true} : null))
			.catch(() => null);
	};
}
