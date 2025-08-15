import {Timestamp} from '@angular/fire/firestore';

export interface PostModel {
	readonly id: string;
	readonly threadId: string;
	readonly body: string;
	readonly authorId: string;
	readonly createdAt: Timestamp;
	readonly updatedAt?: Timestamp;
}

export type PostCreateModel = Omit<PostModel, 'id' | 'createdAt' | 'updatedAt'>;
