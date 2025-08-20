import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AppUserModel} from "../../../../shared/models";
import {AuthService} from "../../../../core/services/auth.service";
import {passwordsMatchAndSameAsOldValidator} from "./passwords-match-and-same-as-old.validator";
import {customEmailValidator, displayNameTakenValidator, emailTakenValidator, trimmedMinLength} from "../../../../shared/validators";
import {handleError} from "../../../../shared/helpers";
import {Router} from "@angular/router";
import {Loader} from '@googlemaps/js-api-loader';
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState, hideLoading, selectLoadingVisible, showLoading} from "../../../../store";
import {AsyncPipe, Location} from "@angular/common";

@Component({
	selector: 'app-edit-profile',
	imports: [
		ReactiveFormsModule,
		AsyncPipe
	],
	templateUrl: './edit-profile.html',
	styleUrl: './edit-profile.css'
})
export class EditProfile implements OnInit, OnDestroy {
	protected form!: FormGroup;
	private uid!: string;
	private user!: AppUserModel;
	protected saving: boolean = false;
	protected error: string | null = null;
	protected photoPreviewUrl: string | null = null;
	private loadingHandled: boolean = false;
	private photoFile: File | null = null;
	private photoPending: boolean = false;
	protected locationLoading: boolean = false;
	protected location: { lat: number, lng: number, name?: string, } | null = null;
	protected locationError: string | null = null;
	protected loading$: Observable<boolean> = this.store.select(selectLoadingVisible);
	private updatePhoto: boolean = false;


	private mapsLoader: Loader = new Loader({
		apiKey: 'AIzaSyA2_yHQyXqtZmicPecRvLN75J0c6D4TLd4',
		version: 'weekly',
	});

	private async initMaps(): Promise<void> {
		await this.mapsLoader.importLibrary('core');
		await this.mapsLoader.importLibrary('maps');
		await this.mapsLoader.importLibrary('geocoding');
	}


	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private store: Store<AppState>,
		private locationForRoutes: Location,
	) {
	}

	async ngOnInit(): Promise<void> {
		try {
			this.store.dispatch(showLoading());

			await this.initMaps();

			this.uid = (await this.authService.currentUid())!;
			this.user = await this.authService.getUser(this.uid);

			const passwordGroupOptions: AbstractControlOptions = {
				validators: [passwordsMatchAndSameAsOldValidator(6)]
			};

			this.form = this.fb.group({
				displayName: [
					this.user.displayName,
					[Validators.required, trimmedMinLength(2)],
					[displayNameTakenValidator(this.authService, this.user.displayName!)]
				],
				email: [
					this.user.email,
					[Validators.required, customEmailValidator()],
					[emailTakenValidator(this.authService, this.user.email)]
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
			this.photoPending = !!this.photoPreviewUrl;
			this.location = this.user.location ?? null;
		} catch (e) {
			this.error = handleError(e);
		} finally {
			if (!this.photoPending) {
				this.handleLoaded();
			}
		}
	}

	protected onPhotoSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length) {
			this.photoFile = input.files[0];
			this.photoPreviewUrl = URL.createObjectURL(this.photoFile);
			this.updatePhoto = true;
		}
	}

	protected onAddLocation(): void {
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

	private async handleLocation(pos: GeolocationPosition): Promise<void> {
		this.locationLoading = true;
		const lat: number = pos.coords.latitude;
		const lng: number = pos.coords.longitude;
		const name: string | null = await this.reverseGeocode(lat, lng);
		this.location = {lat, lng, name: name ?? undefined};
		this.locationLoading = false;
	}


	private async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
		const {Geocoder} = await (window as any).google.maps.importLibrary('geocoding');
		const geocoder = new Geocoder();

		return new Promise((resolve, reject): void => {
			const latlng = {lat: latitude, lng: longitude};
			geocoder.geocode({location: latlng}, (results: any, status: string) => {
				if (status === 'OK' && results.length) {
					resolve(results[0].formatted_address);
				} else {
					reject('Geocoder failed: ' + status);
				}
			});
		});
	}

	protected onPhotoLoaded(): void {
		this.handleLoaded();
	}

	protected clearPhoto(): void {
		this.photoPreviewUrl = null;
		this.photoFile = null;
		this.updatePhoto = true;
	}

	protected clearLocation(): void {
		this.location = null;
	}

	ngOnDestroy(): void {
		this.handleLoaded();
	}

	private handleLoaded(): void {
		if (!this.loadingHandled) {
			this.store.dispatch(hideLoading());
			this.loadingHandled = true;
		}
	}


	protected async submit(): Promise<void> {
		if (this.form.invalid || this.locationLoading) {
			this.form.markAllAsTouched();
			return;
		}
		this.error = null;
		this.saving = true;
		try {
			let displayName = this.form.get('displayName')!.value;
			let email = this.form.get('email')!.value;
			let currentPassword = this.form.get('passwords.currentPassword')?.value;
			let newPassword = this.form.get('passwords.newPassword')?.value;

			currentPassword = currentPassword ? currentPassword.trim() : '';
			newPassword = newPassword ? newPassword.trim() : '';

			const data = {
				displayName: displayName.trim(),
				email: email.trim(),
				currentPassword: currentPassword,
				newPassword: newPassword,
				photoFile: this?.photoFile,
				location: this?.location,
				updatePhoto: this.updatePhoto,
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

	onCancel(): void {
		this.locationForRoutes.back();
	}
}
