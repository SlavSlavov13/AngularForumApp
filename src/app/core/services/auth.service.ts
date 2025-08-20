import {Injectable, Injector, runInInjectionContext} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, EmailAuthCredential, EmailAuthProvider, onAuthStateChanged, reauthenticateWithCredential, signInWithEmailAndPassword, signOut, updatePassword, updateProfile, User, UserCredential, verifyBeforeUpdateEmail} from '@angular/fire/auth';
import {collection, doc, DocumentSnapshot, Firestore, getDoc, getDocs, query, serverTimestamp, setDoc, where} from '@angular/fire/firestore';
import {AppUserModel} from '../../shared/models';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {filter, map, take} from 'rxjs/operators';
import {getDownloadURL, ref, Storage, StorageReference, uploadBytes} from "@angular/fire/storage";
import {mapFirebaseError} from "../../shared/helpers";

@Injectable({providedIn: 'root'})
export class AuthService {
	private userSub: BehaviorSubject<AppUserModel | null> = new BehaviorSubject<AppUserModel | null>(null);
	private initializedSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	readonly user$: Observable<AppUserModel | null> = this.userSub.asObservable();
	readonly initialized$: Observable<boolean> = this.initializedSub.asObservable();

	constructor(
		private injector: Injector,
		private storage: Storage,
		private auth: Auth,
		private db: Firestore,
	) {
		runInInjectionContext(this.injector, async (): Promise<void> => {

			onAuthStateChanged(this.auth, async (fbUser: User | null): Promise<void> => {
				try {
					if (!fbUser || !fbUser.email) {
						this.userSub.next(null);
					} else {
						const userDocRef = doc(this.db, 'users', fbUser.uid);
						const snap = await getDoc(userDocRef);
						const firestoreData = snap.data();
						const appUser: AppUserModel = {
							uid: fbUser.uid,
							email: fbUser.email,
							displayName: fbUser.displayName,
							photoURL: fbUser.photoURL ?? firestoreData?.['photoURL'] ?? null,
							location: firestoreData?.['location'] ?? null,
							createdAt: firestoreData?.['createdAt'],
							lastLogin: firestoreData?.['lastLogin'],
						};
						this.userSub.next(appUser);
						const currentEmail: string = snap.get('email');
						if (currentEmail !== fbUser.email) {
							await setDoc(userDocRef, {email: fbUser.email}, {merge: true});
						}
					}
				} catch (err) {
					throw new Error(mapFirebaseError(err));
				} finally {
					this.initializedSub.next(true);
				}
			});
		});
	}

	async register(email: string, password: string, displayName?: string): Promise<void> {
		await runInInjectionContext(this.injector, async (): Promise<void> => {

			try {
				const cred: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);

				if (displayName) {
					await updateProfile(cred.user, {displayName});
				}

				const appUser: AppUserModel = this.firebaseUserToAppUser(cred.user);
				this.userSub.next(appUser);

				await setDoc(
					doc(this.db, 'users', cred.user.uid),
					{...appUser, createdAt: serverTimestamp(), lastLogin: serverTimestamp()},
					{merge: true}
				);
			} catch (err) {
				throw new Error(mapFirebaseError(err));
			}
		});
	}

	async login(email: string, password: string): Promise<void> {
		await runInInjectionContext(this.injector, async (): Promise<void> => {
			try {
				const cred: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
				await setDoc(
					doc(this.db, 'users', cred.user.uid),
					{lastLogin: serverTimestamp()},
					{merge: true}
				);
			} catch (err) {
				throw new Error(mapFirebaseError(err));
			}
		});

	}

	async logout(): Promise<void> {
		await runInInjectionContext(this.injector, async (): Promise<void> => {
			await signOut(this.auth);
		});
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
				lastLogin: raw.lastLogin,
				location: raw.location ?? null
			};
		});
	}

	async getUsersByIds(ids: string[]): Promise<AppUserModel[]> {
		const users: AppUserModel[] = [];
		for (const id of ids) {
			try {
				const user: AppUserModel = await this.getUser(id);
				users.push(user);
			} catch (err) {
				throw new Error(mapFirebaseError(err));
			}
		}
		return users;
	}

	isDisplayNameTaken(displayName: string): Observable<boolean> {
		return runInInjectionContext(this.injector, (): Observable<boolean> => {
			const q = query(
				collection(this.db, 'users'),
				where('displayName', '==', displayName)
			);
			return from(getDocs(q)).pipe(
				map(snapshot => !snapshot.empty)
			);
		});
	}

	isEmailTaken(email: string): Observable<boolean> {
		return runInInjectionContext(this.injector, (): Observable<boolean> => {
			const q = query(
				collection(this.db, 'users'),
				where('email', '==', email)
			);
			return from(getDocs(q)).pipe(
				map(snapshot => !snapshot.empty)
			);
		});
	}


	async updateUser(data: {
		displayName: string,
		email: string,
		currentPassword: string,
		newPassword: string,
		photoFile: File | null,
		location: {
			lat: number,
			lng: number,
			name?: string
		} | null,
		updatePhoto: boolean,
	}): Promise<void> {
		await runInInjectionContext(this.injector, async (): Promise<void> => {

			await this.waitUntilInitialized();
			const firebaseUser: User = this.auth.currentUser!;

			const profileData: { displayName?: string; } = {};
			if (data.updatePhoto) {
				await this.uploadProfilePhoto(data.photoFile);
			}
			if (data.displayName !== firebaseUser.displayName) profileData.displayName = data.displayName;
			if (Object.keys(profileData).length > 0) {
				await updateProfile(firebaseUser, profileData);
			}

			if (data.email !== firebaseUser.email) {
				if (!data.currentPassword || data.currentPassword.length === 0) {
					throw new Error("Current password is required to change email.");
				}

				const credential: EmailAuthCredential = EmailAuthProvider.credential(firebaseUser.email!, data.currentPassword);
				await reauthenticateWithCredential(firebaseUser, credential);
				await verifyBeforeUpdateEmail(firebaseUser, data.email);
			}

			if (data.newPassword != null && data.newPassword.length > 0 && data.currentPassword != null && data.currentPassword.length > 0 && data.newPassword !== data.currentPassword) {
				const credential: EmailAuthCredential = EmailAuthProvider.credential(firebaseUser.email!, data.currentPassword!);
				await reauthenticateWithCredential(firebaseUser, credential);
				await updatePassword(firebaseUser, data.newPassword);
			}

			const firestoreData: Partial<AppUserModel> = {
				displayName: data.displayName,
				location: data.location ?? null,
			};

			await setDoc(
				doc(this.db, 'users', firebaseUser.uid),
				firestoreData,
				{merge: true}
			);

			const appUser: AppUserModel = this.userSub.value!;
			if (appUser) {
				this.userSub.next({
					...appUser,
					...firestoreData
				});
			}
		});
	}

	async uploadProfilePhoto(file: File | null): Promise<void> {
		await runInInjectionContext(this.injector, async (): Promise<void> => {
			const uid: string = (await this.currentUid())!;

			if (file == null) {
				await setDoc(doc(this.db, 'users', uid), {photoURL: null}, {merge: true});
				const appUser: AppUserModel = this.userSub.value!;
				this.userSub.next({...appUser, photoURL: null});
				return;
			}

			const storageRef: StorageReference = ref(this.storage, `profile-pictures/${uid}/${file.name}`);

			await uploadBytes(storageRef, file);

			const url: string = await getDownloadURL(storageRef);
			await setDoc(doc(this.db, 'users', uid), {photoURL: url}, {merge: true});

			const appUser: AppUserModel = this.userSub.value!;
			this.userSub.next({...appUser, photoURL: url});
		});

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