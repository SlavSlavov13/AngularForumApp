import {Injectable, Injector, runInInjectionContext} from '@angular/core';
import {addDoc, collection, deleteDoc, doc, DocumentData, Firestore, getCountFromServer, getDoc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where, WriteBatch, writeBatch} from '@angular/fire/firestore';
import {PostCreateModel, PostModel} from '../../shared/models';
import {ThreadService} from "./thread.service";

@Injectable({providedIn: 'root'})
export class PostService {
	constructor(
		private db: Firestore,
		private injector: Injector,
	) {
	}

	async listPostsByThread(threadId: string, limitCount?: number): Promise<PostModel[]> {
		return runInInjectionContext(this.injector, async (): Promise<PostModel[]> => {
			let q;
			if (limitCount != null) {
				q = query(
					collection(this.db, 'posts'),
					where('threadId', '==', threadId),
					orderBy('createdAt', 'desc'),
					limit(limitCount)
				);
			} else {
				q = query(
					collection(this.db, 'posts'),
					where('threadId', '==', threadId),
					orderBy('createdAt', 'desc'),
				);
			}
			const snapshot = await getDocs(q);
			return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as PostModel));
		});
	}

	async listPostsByUser(uid: string, limitCount?: number): Promise<PostModel[]> {
		return runInInjectionContext(this.injector, async (): Promise<PostModel[]> => {
			let q;
			if (limitCount != null) {
				q = query(
					collection(this.db, 'posts'),
					where('authorId', '==', uid),
					orderBy('createdAt', 'desc'),
					limit(limitCount)
				);
			} else {
				q = query(
					collection(this.db, 'posts'),
					where('authorId', '==', uid),
					orderBy('createdAt', 'desc')
				);
			}
			const snapshot = await getDocs(q);
			return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as PostModel));
		});
	}

	async getPost(id: string): Promise<PostModel | undefined> {
		return runInInjectionContext(this.injector, async (): Promise<PostModel | undefined> => {
			const ref = doc(this.db, 'posts', id);
			const snapshot = await getDoc(ref);
			if (snapshot.exists()) {
				return {id: snapshot.id, ...snapshot.data()} as PostModel;
			}
			return undefined;
		});
	}

	async getUserPostsCount(uid: string): Promise<number> {
		return await runInInjectionContext(this.injector, async (): Promise<number> => {
			const coll = collection(this.db, 'posts');
			const q = query(coll, where('authorId', '==', uid));
			const snapshot = await getCountFromServer(q);
			return snapshot.data().count;
		});
	}

	async createPost(data: PostCreateModel): Promise<any> {
		return runInInjectionContext(this.injector, async (): Promise<any> => {
			const threadService: ThreadService = this.injector.get(ThreadService);
			const postRef = await addDoc(collection(this.db, 'posts'), {
				...data,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});
			await threadService.incrementReplyCount(data.threadId);
			return postRef;
		});
	}

	async updatePost(id: string, patch: Partial<PostModel>): Promise<void> {
		return runInInjectionContext(this.injector, async (): Promise<void> => {
			const ref = doc(this.db, 'posts', id);
			await updateDoc(ref, {
				...patch,
				updatedAt: serverTimestamp(),
			});
		});
	}

	async deletePost(id: string): Promise<void> {
		return runInInjectionContext(this.injector, async (): Promise<void> => {
			const threadService: ThreadService = this.injector.get(ThreadService);
			const postRef = doc(this.db, 'posts', id);
			const snapshot = await getDoc(postRef);
			if (!snapshot.exists()) {
				return;
			}
			const postData: DocumentData = snapshot.data()!;
			const threadId: string = postData['threadId'];

			await deleteDoc(postRef);
			await threadService.decrementReplyCount(threadId);
		});
	}

	async postExists(id: string): Promise<boolean> {
		return await runInInjectionContext(this.injector, async (): Promise<boolean> => {
			const ref = doc(this.db, 'posts', id);
			const snapshot = await getDoc(ref);
			return snapshot.exists();
		});
	}

	async deletePostsByThreadId(threadId: string): Promise<void> {
		return runInInjectionContext(this.injector, async (): Promise<void> => {
			const postsRef = collection(this.db, 'posts');
			const q = query(postsRef, where('threadId', '==', threadId));
			const postsSnapshot = await getDocs(q);
			const batch: WriteBatch = writeBatch(this.db);
			postsSnapshot.forEach((docSnap): void => {
				batch.delete(docSnap.ref);
			});
			await batch.commit();
		});
	}
}
