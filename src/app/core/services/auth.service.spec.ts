import {TestBed} from '@angular/core/testing';
import {AuthService} from './auth.service';
import {Storage} from '@angular/fire/storage';
import {Auth} from '@angular/fire/auth';
import {Firestore} from '@angular/fire/firestore';
import {Injector} from '@angular/core';

// Minimal Storage mock (expand with methods your service uses)
const storageMock = {
	ref: () => ({}),
};

// Minimal Auth mock with onAuthStateChanged stub
const authMock = {
	onAuthStateChanged: (callback: Function) => {
		// Immediately call callback with null to simulate signed out state
		callback(null);
		return () => {
		}; // unsubscribe function
	},
	currentUser: null,
};

// Minimal Firestore mock (expand with methods your service uses)
const firestoreMock = {};

describe('AuthService', () => {
	let service: AuthService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AuthService,
				{provide: Storage, useValue: storageMock},
				{provide: Auth, useValue: authMock},
				{provide: Firestore, useValue: firestoreMock},
				Injector, // Angular provides this automatically but included here for clarity
			],
		});

		service = TestBed.inject(AuthService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('#currentUid', () => {
		it('should return null when no user is logged in', async () => {
			service['userSub'].next(null);
			const uid = await service.currentUid();
			expect(uid).toBeNull();
		});

		it('should return uid when user is logged in', async () => {
			const mockUser = {
				uid: 'user123',
				email: 'test@example.com',
				displayName: 'name',
				photoURL: '',
				location: null,
				createdAt: undefined,
				lastLogin: undefined,
			};
			service['userSub'].next(mockUser);
			const uid = await service.currentUid();
			expect(uid).toBe('user123');
		});
	});

	describe('#isLoggedIn', () => {
		it('should be false when userSub value is null', async () => {
			service['userSub'].next(null);
			const loggedIn = await service.isLoggedIn();
			expect(loggedIn).toBeFalse();
		});

		it('should be true when userSub value is not null', async () => {
			const mockUser = {
				uid: 'user123',
				email: 'test@example.com',
				displayName: 'name',
				photoURL: '',
				location: null,
				createdAt: undefined,
				lastLogin: undefined,
			};
			service['userSub'].next(mockUser);
			const loggedIn = await service.isLoggedIn();
			expect(loggedIn).toBeTrue();
		});
	});
});
