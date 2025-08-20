import {AbstractControl, ValidationErrors} from "@angular/forms";

export function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
	const password: string = group.get('password')?.value;
	const repeat: string = group.get('repeat')?.value;
	if (password && repeat && password !== repeat) return {noMatch: true};
	return null;
}