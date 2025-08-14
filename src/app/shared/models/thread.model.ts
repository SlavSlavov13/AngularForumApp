import {Timestamp} from '@angular/fire/firestore';

export interface Thread {
	readonly id: string;
	readonly title: string;
	readonly body: string;
	readonly tags: readonly string[];
	readonly authorId: string;
	readonly createdAt: Timestamp | Date;
	readonly updatedAt?: Timestamp | Date;
	readonly replyCount?: number;
}

export type ThreadCreateModel = Omit<Thread, 'id' | 'createdAt' | 'updatedAt' | 'replyCount'>;
