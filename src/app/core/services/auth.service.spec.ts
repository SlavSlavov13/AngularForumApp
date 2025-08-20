import {TestBed} from '@angular/core/testing';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from './auth.service';
import {AppUserModel} from '../../shared/models';

describe('AuthService', () => {
	let service: AuthService;

	// Mock Storage or other dependencies your AuthService requires
	const storageMock = {
		// mock the required methods here, e.g.
		ref: () => ({ /* mock functions */}),
		upload: () => Promise.resolve(),
		// Add any other methods your service uses
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AuthService,
				{provide: Storage, useValue: storageMock}, // Provide Storage mock
				// Add any other dependencies here similarly if needed
			]
		});
		service = TestBed.inject(AuthService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('#currentUid', () => {
		it('should return null when no user is logged in', async () => {
			service['userSub'] = new BehaviorSubject<AppUserModel | null>(null);
			const uid = await service.currentUid();
			expect(uid).toBeNull();
		});

		it('should return uid when user is logged in', async () => {
			const mockUser: AppUserModel = {uid: 'user123', email: 'test@example.com', displayName: 'name', photoURL: '', location: null, createdAt: undefined, lastLogin: undefined};
			service['userSub'] = new BehaviorSubject<AppUserModel | null>(mockUser);
			const uid = await service.currentUid();
			expect(uid).toBe('user123');
		});
	});

	describe('#isLoggedIn', () => {
		it('should be false when userSub value is null', async () => {
			service['userSub'] = new BehaviorSubject<AppUserModel | null>(null);
			const loggedIn = await service.isLoggedIn();
			expect(loggedIn).toBeFalse();
		});

		it('should be true when userSub value is not null', async () => {
			const mockUser: AppUserModel = {uid: 'user123', email: 'test@example.com', displayName: 'name', photoURL: '', location: null, createdAt: undefined, lastLogin: undefined};
			service['userSub'] = new BehaviorSubject<AppUserModel | null>(mockUser);
			const loggedIn = await service.isLoggedIn();
			expect(loggedIn).toBeTrue();
		});
	});
});
