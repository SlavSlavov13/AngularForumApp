import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, User} from '@angular/fire/auth';
import {FirebaseError} from 'firebase/app';

interface AuthUserState {
	uid: string;
	email: string | null;
	displayName: string | null;
}

@Injectable({providedIn: 'root'})
export class AuthService {
	// Reactive user state
	user: WritableSignal<AuthUserState | null> = signal(null);
	private auth = inject(Auth);

	constructor() {
		onAuthStateChanged(this.auth, async (fbUser: User | null) => {
			console.log('Auth state:', fbUser ? `SIGNED IN ${fbUser.uid}` : 'SIGNED OUT');
			if (fbUser) {
				this.user.set({
					uid: fbUser.uid,
					email: fbUser.email,
					displayName: fbUser.displayName
				});
			} else {
				this.user.set(null);
			}
		});
	}

	// Email/Password
	async register(email: string, password: string, displayName?: string): Promise<void> {
		try {
			const cred = await createUserWithEmailAndPassword(this.auth, email, password);
			if (displayName) {
				await updateProfile(cred.user, {displayName});
				this.user.set({
					uid: cred.user.uid,
					email: cred.user.email,
					displayName
				});
			}
		} catch (err) {
			const code = (err as FirebaseError).code ?? '';
			throw new Error(this.mapAuthError(code));
		}
	}

	async login(email: string, password: string): Promise<void> {
		try {
			await signInWithEmailAndPassword(this.auth, email, password);
		} catch (err) {
			const code = (err as FirebaseError).code ?? '';
			throw new Error(this.mapAuthError(code));
		}
	}

	async logout(): Promise<void> {
		await signOut(this.auth);
	}

	// Helpers
	currentUid(): string | null {
		return this.user()?.uid || null;
	}

	isLoggedIn(): boolean {
		return !!this.user();
	}

	// Error mapping
	private mapAuthError(code: string): string {
		switch (code) {
			case 'auth/email-already-in-use':
				return 'This email is already registered.';
			case 'auth/invalid-email':
				return 'Invalid email format.';
			case 'auth/user-not-found':
			case 'auth/wrong-password':
				return 'Incorrect email or password.';
			case 'auth/popup-closed-by-user':
				return 'Sign-in popup was closed before finishing.';
			default:
				return 'An unexpected authentication error occurred.';
		}
	}
}
