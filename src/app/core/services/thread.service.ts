import {inject, Injectable, Injector, runInInjectionContext} from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getCountFromServer, getDoc, increment, limit, orderBy, query, serverTimestamp, updateDoc, where} from '@angular/fire/firestore';
import {from, Observable} from 'rxjs';
import {ThreadCreateModel, ThreadModel} from '../../shared/models';

@Injectable({providedIn: 'root'})
export class ThreadService {
	private db: Firestore = inject(Firestore);
	private injector: Injector = inject(Injector);

	listThreads(limitCount?: number): Observable<ThreadModel[]> {
		return runInInjectionContext(this.injector, (): Observable<ThreadModel[]> => {
			let q;
			if (limitCount !== undefined) {
				q = query(collection(this.db, 'threads'), orderBy('createdAt', 'desc'), limit(limitCount));
			} else {
				q = query(collection(this.db, 'threads'), orderBy('createdAt', 'desc'));
			}
			return collectionData(q, {idField: 'id'}) as Observable<ThreadModel[]>;
		});
	}

	listThreadsByUser(uid: string, limitCount?: number): Observable<ThreadModel[]> {
		return runInInjectionContext(this.injector, (): Observable<ThreadModel[]> => {
			let q;
			if (limitCount !== undefined) {
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
			return collectionData(q, {idField: 'id'}) as Observable<ThreadModel[]>;
		});

	}

	async getUserThreadCount(uid: string): Promise<number> {
		return await runInInjectionContext(this.injector, async (): Promise<number> => {
			const coll = collection(this.db, 'threads');
			const q = query(coll, where('authorId', '==', uid));
			const snapshot = await getCountFromServer(q);
			return snapshot.data().count;
		});
	}


	getThread(id: string): Observable<ThreadModel> {
		return runInInjectionContext(this.injector, (): Observable<ThreadModel> => {
			const ref = doc(this.db, 'threads', id);
			return docData(ref, {idField: 'id'}) as Observable<ThreadModel>;
		});
	}

	async threadExists(id: string): Promise<boolean> {
		return await runInInjectionContext(this.injector, async (): Promise<boolean> => {
			const ref = doc(this.db, 'threads', id);
			const snapshot = await getDoc(ref);
			return snapshot.exists();
		});

	}

	createThread(data: ThreadCreateModel): Observable<any> {
		return runInInjectionContext(this.injector, (): Observable<any> => {
			return from(
				addDoc(collection(this.db, 'threads'), {
					...data,
					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp(),
					replyCount: 0
				})
			);
		});
	}

	updateThread(id: string, patch: Partial<ThreadModel>): Observable<void> {
		return runInInjectionContext(this.injector, (): Observable<void> => {
			const ref = doc(this.db, 'threads', id);
			return from(
				updateDoc(ref, {
					...patch,
					updatedAt: serverTimestamp()
				})
			);
		});
	}

	deleteThread(id: string): Observable<void> {
		return runInInjectionContext(this.injector, (): Observable<void> => {
			return from(deleteDoc(doc(this.db, 'threads', id)));
		});
	}

	incrementReplyCount(threadId: string): Observable<void> {
		return runInInjectionContext(this.injector, (): Observable<void> => {
			const ref = doc(this.db, 'threads', threadId);
			return from(updateDoc(ref, {
				replyCount: increment(1),
				updatedAt: serverTimestamp()
			}));
		});
	}

}
