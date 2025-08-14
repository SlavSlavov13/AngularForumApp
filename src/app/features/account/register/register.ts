import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
	selector: 'app-register',
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './register.html',
	styleUrl: './register.css'
})
export class Register {
	form: FormGroup;

	constructor(private fb: FormBuilder) {
		this.form = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
		});
	}

	submit() {
		if (this.form.invalid) return;
		// TODO: AuthService.register(...)
		console.log('register:', this.form.value);
	}
}
