import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {handleError} from "../../../shared/helpers";

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule],
	templateUrl: './login.html',
	styleUrls: ['./login.css'],
})
export class Login {
	loading: boolean = false;
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
			password: ['', [Validators.required, Validators.minLength(6)]],
		});
	}

	async submit(): Promise<void> {
		if (this.form.invalid || this.loading) {
			this.form.markAllAsTouched();
			return;
		}
		this.error = null;
		this.loading = true;

		const {email, password} = this.form.value as { email: string; password: string };

		try {
			await this.authService.login(email, password);
			const returnUrl: string = this.route.snapshot.queryParamMap.get('returnUrl') || '/threads';
			await this.router.navigateByUrl(returnUrl);
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.loading = false;
		}
	}
}
