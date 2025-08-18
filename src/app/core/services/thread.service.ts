import {inject, Injectable, Injector, runInInjectionContext} from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getCountFromServer, getDoc, increment, limit, orderBy, query, serverTimestamp, updateDoc, where} from '@angular/fire/firestore';
import {from, Observable} from 'rxjs';
import {ThreadCreateModel, ThreadModel} from '../../shared/models';
import {Store} from '@ngrx/store';
import {AppState, hideLoading, showLoading} from '../../store';
import {finalize, map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ThreadService {
	private db: Firestore = inject(Firestore);
	private injector: Injector = inject(Injector);

	constructor(private store: Store<AppState>) {
	}

	listThreads(limitCount?: number): Observable<ThreadModel[]> {
		return runInInjectionContext(this.injector, (): Observable<ThreadModel[]> => {
			this.store.dispatch(showLoading());
			let q;
			if (limitCount != null) {
				q = query(collection(this.db, 'threads'), orderBy('createdAt', 'desc'), limit(limitCount));
			} else {
				q = query(collection(this.db, 'threads'), orderBy('createdAt', 'desc'));
			}
			return collectionData(q, {idField: 'id'}).pipe(
				finalize(() => this.store.dispatch(hideLoading())),
				map(arr => arr as ThreadModel[])
			);
		});
	}

	listThreadsByUser(uid: string, limitCount?: number): Observable<ThreadModel[]> {
		return runInInjectionContext(this.injector, (): Observable<ThreadModel[]> => {
			this.store.dispatch(showLoading());
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
			return collectionData(q, {idField: 'id'}).pipe(
				finalize(() => this.store.dispatch(hideLoading())),
				map(arr => arr as ThreadModel[])
			);
		});
	}

	async getUserThreadsCount(uid: string): Promise<number> {
		this.store.dispatch(showLoading());
		try {
			return await runInInjectionContext(this.injector, async (): Promise<number> => {
				const coll = collection(this.db, 'threads');
				const q = query(coll, where('authorId', '==', uid));
				const snapshot = await getCountFromServer(q);
				return snapshot.data().count;
			});
		} finally {
			this.store.dispatch(hideLoading());
		}
	}

	getThread(id: string): Observable<ThreadModel> {
		return runInInjectionContext(this.injector, (): Observable<ThreadModel> => {
			this.store.dispatch(showLoading());
			const ref = doc(this.db, 'threads', id);
			return docData(ref, {idField: 'id'}).pipe(
				finalize(() => this.store.dispatch(hideLoading())),
				map(doc => doc as ThreadModel)
			);
		});
	}

	async threadExists(id: string): Promise<boolean> {
		this.store.dispatch(showLoading());
		try {
			return await runInInjectionContext(this.injector, async (): Promise<boolean> => {
				const ref = doc(this.db, 'threads', id);
				const snapshot = await getDoc(ref);
				return snapshot.exists();
			});
		} finally {
			this.store.dispatch(hideLoading());
		}
	}

	createThread(data: ThreadCreateModel): Observable<any> {
		return runInInjectionContext(this.injector, (): Observable<any> => {
			this.store.dispatch(showLoading());
			return from(
				addDoc(collection(this.db, 'threads'), {
					...data,
					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp(),
					replyCount: 0
				})
			).pipe(finalize(() => this.store.dispatch(hideLoading())));
		});
	}

	updateThread(id: string, patch: Partial<ThreadModel>): Observable<void> {
		return runInInjectionContext(this.injector, (): Observable<void> => {
			this.store.dispatch(showLoading());
			const ref = doc(this.db, 'threads', id);
			return from(
				updateDoc(ref, {
					...patch,
					updatedAt: serverTimestamp()
				})
			).pipe(finalize(() => this.store.dispatch(hideLoading())));
		});
	}

	deleteThread(id: string): Observable<void> {
		return runInInjectionContext(this.injector, (): Observable<void> => {
			this.store.dispatch(showLoading());
			return from(deleteDoc(doc(this.db, 'threads', id))).pipe(finalize(() => this.store.dispatch(hideLoading())));
		});
	}

	incrementReplyCount(threadId: string): Observable<void> {
		return runInInjectionContext(this.injector, (): Observable<void> => {
			this.store.dispatch(showLoading());
			const ref = doc(this.db, 'threads', threadId);
			return from(
				updateDoc(ref, {
					replyCount: increment(1),
					updatedAt: serverTimestamp()
				})
			).pipe(finalize(() => this.store.dispatch(hideLoading())));
		});
	}

	decrementReplyCount(threadId: string): Observable<void> {
		return runInInjectionContext(this.injector, (): Observable<void> => {
			this.store.dispatch(showLoading());
			const ref = doc(this.db, 'threads', threadId);
			return from(
				updateDoc(ref, {
					replyCount: increment(-1),
					updatedAt: serverTimestamp()
				})
			).pipe(finalize(() => this.store.dispatch(hideLoading())));
		});
	}
}
