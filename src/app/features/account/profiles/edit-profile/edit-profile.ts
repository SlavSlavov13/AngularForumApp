import {Component, OnInit} from '@angular/core';
import {AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AppUserModel} from "../../../../shared/models";
import {AuthService} from "../../../../core/services/auth.service";
import {passwordsValidator} from "./passwords-validator";

@Component({
	selector: 'app-edit-profile',
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './edit-profile.html',
	styleUrl: './edit-profile.css'
})
export class EditProfile implements OnInit {
	form: FormGroup;
	uid!: string;
	user!: AppUserModel;
	loading: boolean = true;
	saving: boolean = false;
	error: string | null = null;
	photoPreviewUrl: string | null = null;
	photoFile: File | null = null;

	constructor(private fb: FormBuilder, private authService: AuthService) {
		const passwordGroupOptions: AbstractControlOptions = {
			validators: [passwordsValidator]
		};

		this.form = this.fb.group({
			displayName: ['', [Validators.required, Validators.minLength(2)]],
			email: ['', [Validators.required, Validators.email]],
			passwords: this.fb.group(
				{
					currentPassword: [''],
					newPassword: [''],
				},
				passwordGroupOptions
			)
		});

	}

	async ngOnInit(): Promise<void> {
		this.loading = true;
		try {
			this.uid = (await this.authService.currentUid())!;
			this.user = await this.authService.getUser(this.uid);
			this.form.patchValue({
				displayName: this.user.displayName,
				email: this.user.email
			});
			this.photoPreviewUrl = this.user.photoURL ?? null;
		} catch (e) {
			this.error = (e as Error)?.message || 'Failed to load user info.';
		} finally {
			this.loading = false;
		}
	}

	onPhotoSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length) {
			this.photoFile = input.files[0];
			this.photoPreviewUrl = URL.createObjectURL(this.photoFile);
		}
	}

	async submit(): Promise<void> {
		if (this.form.invalid || this.loading) {
			this.form.markAllAsTouched();
			return;
		}
		this.error = null;
		this.saving = true;
		try {
			const data = {
				displayName: this.form.get('displayName')!.value,
				email: this.form.get('email')!.value,
				currentPassword: this.form.get('passwords.currentPassword')?.value,
				newPassword: this.form.get('passwords.newPassword')?.value,
				photoFile: this?.photoFile,
				photoURL: this?.photoPreviewUrl,
			}
			await this.authService.updateUser(data)
		} catch (e) {
			this.error = (e as Error)?.message || 'Failed to update profile.';
		} finally {
			this.saving = false;
		}
	}
}
