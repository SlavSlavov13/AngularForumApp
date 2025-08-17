import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthService} from "../../../core/services/auth.service";
import {Router} from "@angular/router";

@Component({
	selector: 'app-register',
	imports: [ReactiveFormsModule, CommonModule],
	templateUrl: './register.html',
	styleUrls: ['./register.css']
})
export class Register {
	form: FormGroup;
	loading: boolean = false;
	error: string | null = null;

	constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
		this.form = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			displayName: ['', [Validators.required, Validators.minLength(2)]]
		});
	}

	async submit(): Promise<void> {
		if (this.form.invalid || this.loading) {
			this.form.markAllAsTouched();
			return;
		}

		this.error = null;
		this.loading = true;
		const {email, password, displayName} = this.form.value;

		try {
			await this.authService.register(email, password, displayName);
			await this.router.navigateByUrl('/threads');
			this.form.reset();
		} catch (e) {
			this.error = (e as Error)?.message || 'Registration failed.';
		} finally {
			this.loading = false;
		}
	}
}
