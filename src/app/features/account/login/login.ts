import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {handleError} from "../../../shared/helpers";
import {trimmedMinLength} from "../../../shared/validators";

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule],
	templateUrl: './login.html',
	styleUrls: ['./login.css'],
})
export class Login {
	loggingIn: boolean = false;
	error: string | null = null;
	form: FormGroup;

	constructor(
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute,
		private fb: FormBuilder
	) {
		this.form = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, trimmedMinLength(6)]],
		});
	}

	async submit(): Promise<void> {
		if (this.form.invalid || this.loggingIn) {
			this.form.markAllAsTouched();
			return;
		}
		this.error = null;
		this.loggingIn = true;

		const {email, password} = this.form.value as { email: string; password: string };

		try {
			await this.authService.login(email.trim(), password.trim());
			const returnUrl: string = this.route.snapshot.queryParamMap.get('returnUrl') || '/threads';
			await this.router.navigateByUrl(returnUrl);
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.loggingIn = false;
		}
	}
}
