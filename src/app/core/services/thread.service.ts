import {inject, Injectable, Injector, runInInjectionContext} from '@angular/core';
import {addDoc, collection, deleteDoc, doc, DocumentReference, DocumentSnapshot, Firestore, getDoc, getDocs, orderBy, query, QuerySnapshot, serverTimestamp, updateDoc, where} from '@angular/fire/firestore';
import {Thread, ThreadCreateModel} from '../../shared/models';

@Injectable({providedIn: 'root'})
export class ThreadService {
	private db: Firestore = inject(Firestore);
	private injector: Injector = inject(Injector); // <-- get an Injector

	/** Get all threads ordered by newest first */
	async listThreads(): Promise<Thread[]> {
		return runInInjectionContext(this.injector, async (): Promise<Thread[]> => {
			const q = query(collection(this.db, 'threads'), orderBy('createdAt', 'desc'));
			const snap = await getDocs(q);
			return snap.docs.map(d => ({id: d.id, ...d.data()} as Thread));
		});
	}

	/** Get threads by a specific user */
	async listThreadsByUser(uid: string): Promise<Thread[]> {
		return runInInjectionContext(this.injector, async (): Promise<Thread[]> => {
			const q = query(
				collection(this.db, 'threads'),
				where('authorId', '==', uid),
				orderBy('createdAt', 'desc')
			);
			const snap: QuerySnapshot = await getDocs(q);
			return snap.docs.map(d => ({id: d.id, ...d.data()} as Thread));
		});
	}

	/** Get a single thread by ID */
	async getThread(id: string): Promise<Thread | null> {
		return runInInjectionContext(this.injector, async (): Promise<Thread | null> => {
			const s: DocumentSnapshot = await getDoc(doc(this.db, 'threads', id));
			return s.exists() ? ({id: s.id, ...s.data()} as Thread) : null;
		});
	}

	/** Create a new thread */
	async createThread(data: ThreadCreateModel): Promise<DocumentReference> {
		return runInInjectionContext(this.injector, (): Promise<DocumentReference> =>
			addDoc(collection(this.db, 'threads'), {
				...data,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
				replyCount: 0
			})
		);
	}

	/** Update an existing thread */
	async updateThread(id: string, patch: Partial<Thread>): Promise<void> {
		return runInInjectionContext(this.injector, (): Promise<void> =>
			updateDoc(doc(this.db, 'threads', id), {
				...patch,
				updatedAt: serverTimestamp()
			})
		);
	}

	/** Delete a thread */
	async deleteThread(id: string): Promise<void> {
		return runInInjectionContext(this.injector, (): Promise<void> =>
			deleteDoc(doc(this.db, 'threads', id))
		);
	}
}
