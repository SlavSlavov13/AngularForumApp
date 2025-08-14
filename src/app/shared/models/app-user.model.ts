import {Timestamp} from '@angular/fire/firestore';

export interface AppUser {
	readonly uid: string;
	readonly email: string;
	readonly displayName: string;
	readonly photoURL?: string;
	readonly createdAt?: Timestamp | Date;
	readonly updatedAt?: Timestamp | Date;
}

export type AppUserCreate = Omit<AppUser, 'createdAt' | 'updatedAt'>;
