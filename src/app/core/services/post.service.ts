import {inject, Injectable, Injector, runInInjectionContext} from '@angular/core';
import {addDoc, collection, deleteDoc, doc, DocumentReference, DocumentSnapshot, Firestore, getDoc, getDocs, orderBy, query, QuerySnapshot, serverTimestamp, updateDoc, where} from '@angular/fire/firestore';
import {PostCreateModel, PostModel} from '../../shared/models';

@Injectable({providedIn: 'root'})
export class PostService {
	private db: Firestore = inject(Firestore);
	private injector: Injector = inject(Injector);

	/**
	 * Get all posts for a specific thread, ordered by newest first.
	 */
	async listPostsByThread(threadId: string): Promise<PostModel[]> {
		return runInInjectionContext(this.injector, async (): Promise<PostModel[]> => {
			const q = query(
				collection(this.db, 'posts'),
				where('threadId', '==', threadId),
				orderBy('createdAt', 'asc') // oldest first; use 'desc' if you want newest first
			);
			const snap: QuerySnapshot = await getDocs(q);
			return snap.docs.map(d => ({id: d.id, ...d.data()} as PostModel));
		});
	}

	/**
	 * Get posts by a specific user (e.g., for profile or My Posts).
	 */
	async listPostsByUser(uid: string): Promise<PostModel[]> {
		return runInInjectionContext(this.injector, async (): Promise<PostModel[]> => {
			const q = query(
				collection(this.db, 'posts'),
				where('authorId', '==', uid),
				orderBy('createdAt', 'desc')
			);
			const snap: QuerySnapshot = await getDocs(q);
			return snap.docs.map(d => ({id: d.id, ...d.data()} as PostModel));
		});
	}

	/**
	 * Get a single post by ID.
	 */
	async getPost(id: string): Promise<PostModel | null> {
		return runInInjectionContext(this.injector, async (): Promise<PostModel | null> => {
			const s: DocumentSnapshot = await getDoc(doc(this.db, 'posts', id));
			return s.exists() ? ({id: s.id, ...s.data()} as PostModel) : null;
		});
	}

	/**
	 * Create a new post (reply).
	 */
	async createPost(data: PostCreateModel): Promise<DocumentReference> {
		return runInInjectionContext(this.injector, (): Promise<DocumentReference> =>
			addDoc(collection(this.db, 'posts'), {
				...data,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp()
			})
		);
	}

	/**
	 * Update an existing post.
	 */
	async updatePost(id: string, patch: Partial<PostModel>): Promise<void> {
		return runInInjectionContext(this.injector, (): Promise<void> =>
			updateDoc(doc(this.db, 'posts', id), {
				...patch,
				updatedAt: serverTimestamp()
			})
		);
	}

	/**
	 * Delete a post.
	 */
	async deletePost(id: string): Promise<void> {
		return runInInjectionContext(this.injector, (): Promise<void> =>
			deleteDoc(doc(this.db, 'posts', id))
		);
	}
}
