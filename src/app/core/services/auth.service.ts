import {inject, Injectable} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, User, UserCredential} from '@angular/fire/auth';
import {doc, DocumentSnapshot, Firestore, getDoc, serverTimestamp, setDoc} from '@angular/fire/firestore';
import {FirebaseError} from 'firebase/app';
import {AppUserModel} from '../../shared/models';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, map, take} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthService {
	private auth: Auth = inject(Auth);
	private db: Firestore = inject(Firestore);

	private userSub: BehaviorSubject<AppUserModel | null> = new BehaviorSubject<AppUserModel | null>(null);
	private initializedSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	readonly user$: Observable<AppUserModel | null> = this.userSub.asObservable();
	readonly initialized$: Observable<boolean> = this.initializedSub.asObservable();

	readonly loggedIn$: Observable<boolean> = this.user$.pipe(map(u => u !== null));

	constructor() {
		onAuthStateChanged(this.auth, (fbUser: User | null): void => {
			try {
				if (!fbUser || !fbUser.email) {
					this.userSub.next(null);
				} else {
					this.userSub.next(this.firebaseUserToAppUser(fbUser));
				}
			} finally {
				this.initializedSub.next(true);
			}
		});
	}

	async register(email: string, password: string, displayName?: string): Promise<void> {
		try {
			const cred: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);

			if (displayName) {
				await updateProfile(cred.user, {displayName});
			}

			const appUser: AppUserModel = this.firebaseUserToAppUser(cred.user);
			this.userSub.next(appUser);

			await setDoc(
				doc(this.db, 'users', cred.user.uid),
				{...appUser, createdAt: serverTimestamp()},
				{merge: true}
			);
		} catch (err) {
			const code: string = (err as FirebaseError).code ?? '';
			throw new Error(code);
		}
	}

	async login(email: string, password: string): Promise<void> {
		try {
			const cred: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
			const appUser: AppUserModel = this.firebaseUserToAppUser(cred.user);
			this.userSub.next(appUser);

			await setDoc(
				doc(this.db, 'users', cred.user.uid),
				{...appUser, lastLogin: serverTimestamp()},
				{merge: true}
			);
		} catch (err) {
			const code: string = (err as FirebaseError).code ?? '';
			throw new Error(code);
		}
	}

	async logout(): Promise<void> {
		await signOut(this.auth);
		// onAuthStateChanged will push null into userSub
	}

	async getUser(id: string): Promise<AppUserModel | null> {
		const s: DocumentSnapshot = await getDoc(doc(this.db, 'users', id));
		if (!s.exists()) return null;

		const raw = s.data() as Partial<AppUserModel>;
		if (!raw.email) {
			throw new Error('Invalid user document: missing email');
		}

		return {
			uid: raw.uid ?? s.id,
			email: raw.email,
			displayName: raw.displayName ?? null,
			photoURL: raw.photoURL ?? null,
			createdAt: raw.createdAt,
			lastLogin: raw.lastLogin
		};
	}

	waitUntilInitialized(): Promise<void> {
		if (this.initializedSub.value) return Promise.resolve();
		return new Promise<void>((resolve): void => {
			this.initialized$
				.pipe(filter(v => v), take(1))
				.subscribe((): void => resolve());
		});
	}

	async currentUid(): Promise<string | null> {
		await this.waitUntilInitialized();
		return this.userSub.value?.uid ?? null;
	}

	async isLoggedIn(): Promise<boolean> {
		await this.waitUntilInitialized();
		return this.userSub.value !== null;
	}

	private firebaseUserToAppUser(u: User): AppUserModel {
		if (!u.email) {
			throw new Error('Missing email on Firebase User');
		}
		return {
			uid: u.uid,
			email: u.email,
			displayName: u.displayName ?? null,
			photoURL: u.photoURL ?? null
		};
	}
}
