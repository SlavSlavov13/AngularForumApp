import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable, of, Subject} from 'rxjs';
import {catchError, debounceTime, first, map, switchMap} from 'rxjs/operators';
import {AuthService} from "../../core/services/auth.service";

const controlSubjects = new WeakMap<AbstractControl, Subject<string>>();

export function emailTakenValidator(
	currentEmail: string | null,
	authService: AuthService
): AsyncValidatorFn {
	return (control: AbstractControl): Observable<ValidationErrors | null> => {
		if (!control.value) return of(null);
		if (currentEmail === control.value) return of(null)

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
				authService.isEmailTaken(value).pipe(
					map(isTaken => (isTaken ? {emailTaken: true} : null)),
					catchError(() => of(null))
				)
			)
		);
	};
}
