import {Component, OnInit} from '@angular/core';
import {AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AppUserModel} from "../../../../shared/models";
import {AuthService} from "../../../../core/services/auth.service";
import {passwordsMatchAndSameAsOldValidator} from "./passwordsMatchAndSameAsOld.validator";
import {displayNameTakenValidator, emailTakenValidator} from "../../../../shared/validators";
import {handleError} from "../../../../shared/helpers";
import {Router} from "@angular/router";

@Component({
	selector: 'app-edit-profile',
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './edit-profile.html',
	styleUrl: './edit-profile.css'
})
export class EditProfile implements OnInit {
	form!: FormGroup;
	uid!: string;
	user!: AppUserModel;
	loading: boolean = true;
	saving: boolean = false;
	error: string | null = null;
	photoPreviewUrl: string | null = null;
	photoFile: File | null = null;
	locationLoading: boolean = false;
	location: { lat: number, lng: number, name?: string, } | null = null;
	locationError: string | null = null;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.uid = (await this.authService.currentUid())!;
			this.user = await this.authService.getUser(this.uid);

			const passwordGroupOptions: AbstractControlOptions = {
				validators: [passwordsMatchAndSameAsOldValidator]
			};

			this.form = this.fb.group({
				displayName: [
					this.user.displayName,
					[Validators.required, Validators.minLength(2)],
					[displayNameTakenValidator(this.user.displayName, this.authService)]
				],
				email: [
					this.user.email,
					[Validators.required, Validators.email],
					[emailTakenValidator(this.user.email, this.authService)]
				],
				passwords: this.fb.group(
					{
						currentPassword: [''],
						newPassword: [''],
						repeatNewPassword: [''],
					},
					passwordGroupOptions
				)
			});

			this.photoPreviewUrl = this.user.photoURL ?? null;
			this.location = this.user.location ?? null;
		} catch (e) {
			this.error = handleError(e);
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

	onAddLocation(): void {
		this.locationLoading = true;
		this.locationError = null;

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos: GeolocationPosition) => {
					this.handleLocation(pos);
				},
				(err: GeolocationPositionError) => {
					this.locationError = err.message || 'Failed to get location.';
					this.locationLoading = false;
				}
			);
		} else {
			this.locationError = 'Geolocation not supported';
			this.locationLoading = false;
		}
	}

	async handleLocation(pos: GeolocationPosition): Promise<void> {
		const lat: number = pos.coords.latitude;
		const lng: number = pos.coords.longitude;
		const name: string | null = await this.reverseGeocode(lat, lng);
		this.location = {lat, lng, name: name ?? undefined};
		this.locationLoading = false;
	}


	async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
		return new Promise((resolve, reject): void => {
			const geocoder = new (window as any).google.maps.Geocoder();
			const latlng = {lat: latitude, lng: longitude};
			geocoder.geocode({location: latlng}, (results: any, status: string): void => {
				if (status === 'OK' && results.length) {
					resolve(results[0].formatted_address);
				} else {
					reject('Geocoder failed: ' + status);
				}
			});
		});
	}


	clearPhoto(): void {
		this.photoPreviewUrl = null;
		this.photoFile = null;
	}

	clearLocation(): void {
		this.location = null;
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
				location: this?.location
			}
			await this.authService.updateUser(data)
			if (data.email !== this.user.email) {
				alert('For email change you will receive an email on the new email address (check spam). For changes to take affect you must click the link in the email and then log out and back in in the website.')
			}
			await this.router.navigateByUrl('/my-profile');
		} catch (e) {
			this.error = handleError(e);
		} finally {
			this.saving = false;
		}
	}
}
