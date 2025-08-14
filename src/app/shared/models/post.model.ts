export interface Post {
	id: string;
	threadId: string;
	body: string;
	authorId: string;
	createdAt: Date;
	updatedAt: Date;
}