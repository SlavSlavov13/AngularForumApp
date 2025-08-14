import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from "../../../core/services/auth.service";

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule],
	templateUrl: './login.html',
	styleUrls: ['./login.css']
})
export class Login {
	loading: boolean = false;
	error: string | null = null;
	private fb: FormBuilder = inject(FormBuilder);
	form: FormGroup = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(6)]],
	});
	private auth: AuthService = inject(AuthService);
	private router: Router = inject(Router);

	async submit() {
		if (this.form.invalid || this.loading) return;
		this.error = null;
		this.loading = true;

		const {email, password} = this.form.value;

		try {
			await this.auth.login(email, password);
			// Navigate to a protected page or home after login
			await this.router.navigateByUrl('/'); // change to your target route
		} catch (e) {
			this.error = (e as Error)?.message || 'Login failed.';
		} finally {
			this.loading = false;
		}
	}
}
