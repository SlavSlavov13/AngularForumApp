import {Timestamp} from '@angular/fire/firestore';

export interface ThreadModel {
	readonly id: string;
	readonly title: string;
	readonly body: string;
	readonly tags: readonly string[];
	readonly authorId: string;
	readonly createdAt: Timestamp;
	readonly updatedAt?: Timestamp;
	readonly replyCount: number;
}

export type ThreadCreateModel = Omit<ThreadModel, 'id' | 'createdAt' | 'updatedAt' | 'replyCount'>;
