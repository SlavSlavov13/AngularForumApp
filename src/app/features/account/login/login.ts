import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
	selector: 'app-login',
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './login.html',
	styleUrl: './login.css'
})
export class Login {
	form: FormGroup;

	constructor(private fb: FormBuilder) {
		this.form = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
		});
	}

	submit() {
		if (this.form.invalid) return;
		// TODO: AuthService.login(...)
		console.log('login:', this.form.value);
	}
}
