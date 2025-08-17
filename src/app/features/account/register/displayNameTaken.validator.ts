import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable, of, Subject} from 'rxjs';
import {catchError, debounceTime, first, map, switchMap} from 'rxjs/operators';
import {inject} from "@angular/core";
import {AuthService} from "../../../core/services/auth.service";

// Store a separate debounced observable for each control
const controlSubjects = new WeakMap<AbstractControl, Subject<string>>();

export function displayNameTakenValidator(): AsyncValidatorFn {
	const authService: AuthService = inject(AuthService);

	return (control: AbstractControl): Observable<ValidationErrors | null> => {
		if (!control.value) return of(null);

		// Get or create the subject for this control
		let subject = controlSubjects.get(control);
		if (!subject) {
			subject = new Subject<string>();
			controlSubjects.set(control, subject);

			control.valueChanges.pipe(
				debounceTime(500)
			).subscribe(value => {
				subject!.next(value);
			});
		}

		// Fire validation only on next debounced value—even if validator called multiple times
		return subject.pipe(
			first(),
			switchMap(value =>
				authService.isDisplayNameTaken(value).pipe(
					map(isTaken => (isTaken ? {displayNameTaken: true} : null)),
					catchError(() => of(null))
				)
			)
		);
	};
}
