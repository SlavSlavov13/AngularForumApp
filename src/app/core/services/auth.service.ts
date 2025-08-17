import {inject, Injectable, Injector, runInInjectionContext} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, User, UserCredential} from '@angular/fire/auth';
import {doc, DocumentSnapshot, Firestore, getDoc, serverTimestamp, setDoc} from '@angular/fire/firestore';
import {FirebaseError} from 'firebase/app';
import {AppUserModel} from '../../shared/models';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, take} from 'rxjs/operators';
import {FirebaseStorage, getDownloadURL, getStorage, ref, StorageReference, uploadBytes} from "@angular/fire/storage";

@Injectable({providedIn: 'root'})
export class AuthService {
	private injector: Injector = inject(Injector);
	private storage: FirebaseStorage = getStorage();

	private auth: Auth = inject(Auth);
	private db: Firestore = inject(Firestore);

	private userSub: BehaviorSubject<AppUserModel | null> = new BehaviorSubject<AppUserModel | null>(null);
	private initializedSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	readonly user$: Observable<AppUserModel | null> = this.userSub.asObservable();
	readonly initialized$: Observable<boolean> = this.initializedSub.asObservable();

	constructor() {
		onAuthStateChanged(this.auth, (fbUser: User | null): void => {
			try {
				if (!fbUser || !fbUser.email) {
					this.userSub.next(null);
				} else {
					this.userSub.next(this.firebaseUserToAppUser(fbUser));
				}
			} catch (err) {
				const code: string = (err as FirebaseError).code ?? '';
				const message: string = (err as FirebaseError).message ?? '';
				throw new Error(`${code}: ${message}`.trim());
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

			await runInInjectionContext(this.injector, async (): Promise<void> => {
				await setDoc(
					doc(this.db, 'users', cred.user.uid),
					{...appUser, createdAt: serverTimestamp()},
					{merge: true}
				);
			});
		} catch (err) {
			const code: string = (err as FirebaseError).code ?? '';
			const message: string = (err as FirebaseError).message ?? '';
			throw new Error(`${code}: ${message}`.trim());
		}
	}

	async login(email: string, password: string): Promise<void> {
		try {
			const cred: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
			const appUser: AppUserModel = this.firebaseUserToAppUser(cred.user);
			this.userSub.next(appUser);

			await runInInjectionContext(this.injector, async (): Promise<void> => {
				await setDoc(
					doc(this.db, 'users', cred.user.uid),
					{...appUser, lastLogin: serverTimestamp()},
					{merge: true}
				);
			});
		} catch (err) {
			const code: string = (err as FirebaseError).code ?? '';
			const message: string = (err as FirebaseError).message ?? '';
			throw new Error(`${code}: ${message}`.trim());
		}
	}

	async logout(): Promise<void> {
		this.userSub.next(null);
		await signOut(this.auth);
	}

	async getUser(id: string): Promise<AppUserModel> {
		return await runInInjectionContext(this.injector, async (): Promise<AppUserModel> => {
			const s: DocumentSnapshot = await getDoc(doc(this.db, 'users', id));

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
		});
	}

	async uploadProfilePhoto(file: File): Promise<void> {
		const uid: string = (await this.currentUid())!;

		const storageRef: StorageReference = ref(this.storage, `profile-pictures/${uid}/${file.name}`);

		await uploadBytes(storageRef, file);

		const url: string = await getDownloadURL(storageRef);

		await setDoc(doc(this.db, 'users', uid), {photoURL: url}, {merge: true});

		const appUser: AppUserModel = this.userSub.value!;
		if (appUser) {
			this.userSub.next({...appUser, photoURL: url});
		}
	}


	async userExists(id: string): Promise<boolean> {
		return await runInInjectionContext(this.injector, async (): Promise<boolean> => {
			const snapshot = await getDoc(doc(this.db, 'users', id));
			return snapshot.exists();
		});
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
