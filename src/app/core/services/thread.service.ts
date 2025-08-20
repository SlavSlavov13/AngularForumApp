import {Injectable, Injector, runInInjectionContext} from '@angular/core';
import {addDoc, collection, deleteDoc, doc, Firestore, getCountFromServer, getDoc, getDocs, increment, limit, orderBy, query, serverTimestamp, updateDoc, where} from '@angular/fire/firestore';
import {ThreadCreateModel, ThreadModel} from '../../shared/models';
import {PostService} from "./post.service";

@Injectable({providedIn: 'root'})
export class ThreadService {
	constructor(
		private db: Firestore,
		private injector: Injector,
	) {
	}

	async listThreads(limitCount?: number): Promise<ThreadModel[]> {
		return runInInjectionContext(this.injector, async (): Promise<ThreadModel[]> => {
			let q;
			if (limitCount != null) {
				q = query(collection(this.db, 'threads'), orderBy('createdAt', 'desc'), limit(limitCount));
			} else {
				q = query(collection(this.db, 'threads'), orderBy('createdAt', 'desc'));
			}
			const snapshot = await getDocs(q);
			return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as ThreadModel));
		});
	}

	async listThreadsByUser(uid: string, limitCount?: number): Promise<ThreadModel[]> {
		return runInInjectionContext(this.injector, async (): Promise<ThreadModel[]> => {
			let q;
			if (limitCount != null) {
				q = query(
					collection(this.db, 'threads'),
					where('authorId', '==', uid),
					orderBy('createdAt', 'desc'),
					limit(limitCount)
				);
			} else {
				q = query(
					collection(this.db, 'threads'),
					where('authorId', '==', uid),
					orderBy('createdAt', 'desc')
				);
			}
			const snapshot = await getDocs(q);
			return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as ThreadModel));
		});
	}

	async getUserThreadsCount(uid: string): Promise<number> {
		return await runInInjectionContext(this.injector, async (): Promise<number> => {
			const coll = collection(this.db, 'threads');
			const q = query(coll, where('authorId', '==', uid));
			const snapshot = await getCountFromServer(q);
			return snapshot.data().count;
		});
	}

	async getThread(id: string): Promise<ThreadModel | undefined> {
		return runInInjectionContext(this.injector, async (): Promise<ThreadModel | undefined> => {
			const ref = doc(this.db, 'threads', id);
			const snapshot = await getDoc(ref);
			if (snapshot.exists()) {
				return {id: snapshot.id, ...snapshot.data()} as ThreadModel;
			}
			return undefined;
		});
	}

	async threadExists(id: string): Promise<boolean> {
		return await runInInjectionContext(this.injector, async (): Promise<boolean> => {
			const ref = doc(this.db, 'threads', id);
			const snapshot = await getDoc(ref);
			return snapshot.exists();
		});
	}

	async createThread(data: ThreadCreateModel): Promise<any> {
		return runInInjectionContext(this.injector, async (): Promise<any> => {
			return await addDoc(collection(this.db, 'threads'), {
				...data,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
				replyCount: 0
			});
		});
	}

	async updateThread(id: string, patch: Partial<ThreadModel>): Promise<void> {
		return runInInjectionContext(this.injector, async (): Promise<void> => {
			const ref = doc(this.db, 'threads', id);
			await updateDoc(ref, {
				...patch,
				updatedAt: serverTimestamp()
			});
		});
	}

	async deleteThread(id: string): Promise<void> {
		return runInInjectionContext(this.injector, async (): Promise<void> => {
			const postService: PostService = this.injector.get(PostService);
			const threadRef = doc(this.db, 'threads', id);
			await deleteDoc(threadRef);
			await postService.deletePostsByThreadId(id);
		});
	}

	async incrementReplyCount(threadId: string): Promise<void> {
		return runInInjectionContext(this.injector, async (): Promise<void> => {
			const ref = doc(this.db, 'threads', threadId);
			await updateDoc(ref, {
				replyCount: increment(1),
				updatedAt: serverTimestamp()
			});
		});
	}

	async decrementReplyCount(threadId: string): Promise<void> {
		return runInInjectionContext(this.injector, async (): Promise<void> => {
			const ref = doc(this.db, 'threads', threadId);
			await updateDoc(ref, {
				replyCount: increment(-1),
				updatedAt: serverTimestamp()
			});
		});
	}

}