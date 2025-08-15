import {Timestamp} from '@angular/fire/firestore';

export interface AppUserModel {
	readonly uid: string;
	readonly email: string;
	readonly displayName: string | null;
	readonly photoURL?: string | null;
	readonly createdAt?: Timestamp;
	readonly lastLogin?: Timestamp;
}
