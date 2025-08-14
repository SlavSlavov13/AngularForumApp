import {Timestamp} from '@angular/fire/firestore';

export interface Post {
	readonly id: string;
	readonly threadId: string;
	readonly body: string;
	readonly authorId: string;
	readonly createdAt: Timestamp | Date;
	readonly updatedAt?: Timestamp | Date;
}

export type PostCreateModel = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;
