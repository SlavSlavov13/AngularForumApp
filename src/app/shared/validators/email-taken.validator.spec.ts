import {FormControl} from '@angular/forms';
import {emailTakenValidator} from "./email-taken.validator";

describe('emailTakenValidator', () => {
	let authServiceMock: any;

	beforeEach(() => {
		authServiceMock = {
			isEmailTaken: jasmine.createSpy(),
		};
	});

	it('should resolve null if control value is empty', async () => {
		const validator = emailTakenValidator(authServiceMock);
		const control = new FormControl('');
		await expectAsync(validator(control)).toBeResolvedTo(null);
	});

	it('should resolve null if control value matches currentEmail', async () => {
		const validator = emailTakenValidator(authServiceMock, 'test@example.com');
		const control = new FormControl('test@example.com');
		await expectAsync(validator(control)).toBeResolvedTo(null);
	});

	it('should return error object if email is taken', async () => {
		authServiceMock.isEmailTaken.and.returnValue(Promise.resolve(true));
		const validator = emailTakenValidator(authServiceMock);
		const control = new FormControl('taken@example.com');
		await expectAsync(validator(control)).toBeResolvedTo({emailTaken: true});
	});

	it('should return null if email is not taken', async () => {
		authServiceMock.isEmailTaken.and.returnValue(Promise.resolve(false));
		const validator = emailTakenValidator(authServiceMock);
		const control = new FormControl('available@example.com');
		await expectAsync(validator(control)).toBeResolvedTo(null);
	});

	it('should return null if authService call fails', async () => {
		authServiceMock.isEmailTaken.and.returnValue(Promise.reject('error'));
		const validator = emailTakenValidator(authServiceMock);
		const control = new FormControl('error@example.com');
		await expectAsync(validator(control)).toBeResolvedTo(null);
	});
});
