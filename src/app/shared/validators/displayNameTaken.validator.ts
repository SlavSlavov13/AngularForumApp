import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable, of, Subject} from 'rxjs';
import {catchError, debounceTime, first, map, switchMap} from 'rxjs/operators';
import {AuthService} from "../../core/services/auth.service";

const controlSubjects = new WeakMap<AbstractControl, Subject<string>>();

export function displayNameTakenValidator(
	authService: AuthService,
	currentDisplayName?: string,
): AsyncValidatorFn {
	return (control: AbstractControl): Observable<ValidationErrors | null> => {
		if (!control.value) return of(null);

		if (currentDisplayName && currentDisplayName === control.value) return of(null)

		let subject: Subject<string> | undefined = controlSubjects.get(control);
		if (!subject) {
			subject = new Subject<string>();
			controlSubjects.set(control, subject);

			control.valueChanges.pipe(
				debounceTime(500)
			).subscribe(value => {
				subject!.next(value);
			});
		}

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
