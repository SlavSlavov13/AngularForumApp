export interface Thread {
	id: string;
	title: string;
	body: string;
	tags: string[];
	authorId: string;
	createdAt: Date;
	updatedAt: Date;
	replyCount?: number;
}