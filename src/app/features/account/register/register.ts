import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../core/services/auth.service';
import {Router} from '@angular/router';
import {passwordMatchValidator} from "./passwordMatch.validator";
import {displayNameTakenValidator} from "../../../shared/validators";

@Component({
	selector: 'app-register',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './register.html',
	styleUrls: ['./register.css']
})
export class Register implements OnInit {
	form!: FormGroup;
	loading: boolean = false;
	error: string | null = null;

	constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
	}

	ngOnInit(): void {
		this.form = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			displayName: [
				'',
				[Validators.required, Validators.minLength(2)],
				[displayNameTakenValidator(null, this.authService)]
			],
			passwords: this.fb.group({
				password: ['', [Validators.required, Validators.minLength(6)]],
				repeat: ['', [Validators.required]],
			}, {validators: passwordMatchValidator}),
		});
	}

	get passwords(): FormGroup {
		return this.form.get('passwords') as FormGroup;
	}


	async submit(): Promise<void> {
		if (this.form.invalid || this.loading) {
			this.form.markAllAsTouched();
			return;
		}

		this.error = null;
		this.loading = true;
		const {email, displayName, passwords} = this.form.value;
		const password: string = passwords.password;

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
