import {inject, Injectable, Injector, runInInjectionContext, signal, WritableSignal} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, User, UserCredential} from '@angular/fire/auth';
import {FirebaseError} from 'firebase/app';
import {doc, DocumentSnapshot, Firestore, getDoc, serverTimestamp, setDoc} from '@angular/fire/firestore';

interface AuthUserState {
	uid: string;
	email: string | null;
	displayName: string | null;
	photoURL?: string | null;
}

@Injectable({providedIn: 'root'})
export class AuthService {
	/** Reactive user state */
	user: WritableSignal<AuthUserState | null> = signal(null);

	/** Firebase Auth injection */
	private auth: Auth = inject(Auth);

	/** Injector for runInInjectionContext */
	private injector: Injector = inject(Injector);

	private db: Firestore = inject(Firestore);

	constructor() {
		// Keep the user state in sync with Firebase Auth
		runInInjectionContext(this.injector, () => {
			onAuthStateChanged(this.auth, (fbUser: User | null): void => {
				if (fbUser) {
					this.user.set({
						uid: fbUser.uid,
						email: fbUser.email,
						displayName: fbUser.displayName,
						photoURL: fbUser.photoURL
					});
				} else {
					this.user.set(null);
				}
			});
		});
	}

	/** Registration with Firestore profile creation */
	async register(email: string, password: string, displayName?: string): Promise<void> {
		return runInInjectionContext(this.injector, async (): Promise<void> => {
			const firestore = inject(Firestore);
			try {
				// 1. Create a user in Firebase Auth
				const cred: UserCredential =
					await createUserWithEmailAndPassword(this.auth, email, password);

				// 2. Set Auth displayName if provided
				if (displayName) {
					await updateProfile(cred.user, {displayName});
				}

				// 3. Update local signal
				this.user.set({
					uid: cred.user.uid,
					email: cred.user.email,
					displayName: displayName || cred.user.displayName,
					photoURL: cred.user.photoURL
				});

				// 4. Duplicate to Firestore
				await setDoc(
					doc(firestore, 'users', cred.user.uid),
					{
						uid: cred.user.uid,
						email: cred.user.email,
						displayName: displayName || cred.user.displayName || null,
						photoURL: cred.user.photoURL || null,
						createdAt: serverTimestamp()
					},
					{merge: true}
				);

			} catch (err) {
				const code = (err as FirebaseError).code ?? '';
				throw new Error(this.mapAuthError(code));
			}
		});
	}

	/** Login + ensure Firestore profile exists/updated */
	async login(email: string, password: string): Promise<void> {
		return runInInjectionContext(this.injector, async (): Promise<void> => {
			const firestore = inject(Firestore);
			try {
				// 1. Sign in
				const cred = await signInWithEmailAndPassword(this.auth, email, password);

				// 2. Ensure/Update Firestore user doc
				if (cred.user) {
					await setDoc(
						doc(firestore, 'users', cred.user.uid),
						{
							uid: cred.user.uid,
							email: cred.user.email,
							displayName: cred.user.displayName || null,
							photoURL: cred.user.photoURL || null,
							lastLogin: serverTimestamp()
						},
						{merge: true}
					);
				}
			} catch (err) {
				const code = (err as FirebaseError).code ?? '';
				throw new Error(this.mapAuthError(code));
			}
		});
	}

	/** Logout */
	async logout(): Promise<void> {
		return runInInjectionContext(this.injector, async (): Promise<void> => {
			await signOut(this.auth);
		});
	}

	async getUser(id: string): Promise<User | null> {
		return runInInjectionContext(this.injector, async (): Promise<User | null> => {
			const s: DocumentSnapshot = await getDoc(doc(this.db, 'users', id));
			return s.exists() ? ({uid: s.id, ...s.data()} as User) : null;
		});
	}

	/** State helpers */
	currentUid(): string | null {
		return this.user()?.uid || null;
	}

	isLoggedIn(): boolean {
		return !!this.user();
	}

	/** Error mapper */
	private mapAuthError(code: string): string {
		switch (code) {
			case 'auth/invalid-credential':
				return 'Invalid credentials. Please try again.';
			case 'auth/email-already-in-use':
				return 'This email is already registered.';
			case 'auth/invalid-email':
				return 'Enter a valid email address.';
			case 'auth/operation-not-allowed':
				return 'This sign-in method is not available.';
			case 'auth/weak-password':
				return 'Choose a stronger password.';
			case 'auth/user-not-found':
				return 'No account found with this email.';
			case 'auth/wrong-password':
				return 'Incorrect password.';
			case 'auth/user-disabled':
				return 'This account has been disabled.';
			case 'auth/account-exists-with-different-credential':
				return 'An account with this email exists using a different sign-in method.';
			case 'auth/popup-blocked':
				return 'The sign-in popup was blocked. Allow popups and try again.';
			case 'auth/popup-closed-by-user':
				return 'The sign-in popup was closed before completing.';
			case 'auth/cancelled-popup-request':
				return 'Another sign-in popup was already open.';
			case 'auth/unauthorized-domain':
				return 'This domain is not authorized for sign-in.';
			case 'auth/invalid-oauth-client-id':
				return 'The sign-in client configuration is invalid.';
			case 'auth/credential-already-in-use':
				return 'These credentials are already linked to another account.';
			case 'auth/multi-factor-auth-required':
				return 'Additional verification is required to sign in.';
			case 'auth/invalid-verification-code':
				return 'Invalid verification code.';
			case 'auth/invalid-verification-id':
				return 'Your verification session has expired. Please try again.';
			case 'auth/network-request-failed':
				return 'Network error. Check the connection and try again.';
			case 'auth/quota-exceeded':
				return 'Too many attempts. Try again later.';
			case 'auth/auth-domain-config-required':
				return 'Sign-in configuration is incomplete.';
			case 'auth/operation-not-supported-in-this-environment':
				return 'This operation is not supported in the current environment.';
			case 'auth/argument-error':
				return 'Invalid authentication request.';
			case 'auth/app-not-authorized':
				return 'This app is not authorized for Authentication.';
			default:
				return 'An unexpected authentication error occurred.';
		}
	}
}
