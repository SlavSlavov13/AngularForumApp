import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthService} from "../../../core/services/auth.service";

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

	constructor(private fb: FormBuilder, private auth: AuthService) {
		this.form = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			displayName: ['', [Validators.required, Validators.minLength(2)]]
		});
	}

	async submit() {
		if (this.form.invalid || this.loading) return;

		this.error = null;
		this.loading = true;
		const {email, password, displayName} = this.form.value;

		try {
			await this.auth.register(email, password);
			console.log('Registered successfully');
			this.form.reset();
		} catch (e) {
			this.error = (e as Error).message || 'Registration failed.';
		} finally {
			this.loading = false;
		}
	}
}
