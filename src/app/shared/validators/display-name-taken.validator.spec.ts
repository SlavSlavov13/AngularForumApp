import {FormControl} from '@angular/forms';
import {displayNameTakenValidator} from "./display-name-taken.validator";

describe('displayNameTakenValidator', () => {
	let authServiceMock: any;

	beforeEach(() => {
		authServiceMock = {
			isDisplayNameTaken: jasmine.createSpy(),
		};
	});

	it('should resolve null if control value is empty', async () => {
		const validator = displayNameTakenValidator(authServiceMock);
		const control = new FormControl('');
		await expectAsync(validator(control)).toBeResolvedTo(null);
	});

	it('should resolve null if control value matches currentDisplayName', async () => {
		const validator = displayNameTakenValidator(authServiceMock, 'currentName');
		const control = new FormControl('currentName');
		await expectAsync(validator(control)).toBeResolvedTo(null);
	});

	it('should return error object if display name is taken', async () => {
		authServiceMock.isDisplayNameTaken.and.returnValue(Promise.resolve(true));
		const validator = displayNameTakenValidator(authServiceMock);
		const control = new FormControl('takenName');
		await expectAsync(validator(control)).toBeResolvedTo({displayNameTaken: true});
	});

	it('should return null if display name is not taken', async () => {
		authServiceMock.isDisplayNameTaken.and.returnValue(Promise.resolve(false));
		const validator = displayNameTakenValidator(authServiceMock);
		const control = new FormControl('availableName');
		await expectAsync(validator(control)).toBeResolvedTo(null);
	});

	it('should return null if authService call fails', async () => {
		authServiceMock.isDisplayNameTaken.and.returnValue(Promise.reject('error'));
		const validator = displayNameTakenValidator(authServiceMock);
		const control = new FormControl('errorName');
		await expectAsync(validator(control)).toBeResolvedTo(null);
	});
});
