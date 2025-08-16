import {inject, Injectable} from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getCountFromServer, getDoc, limit, orderBy, query, serverTimestamp, updateDoc, where} from '@angular/fire/firestore';
import {from, Observable} from 'rxjs';
import {ThreadCreateModel, ThreadModel} from '../../shared/models';

@Injectable({providedIn: 'root'})
export class ThreadService {
	private db: Firestore = inject(Firestore);

	listThreads(limitCount?: number): Observable<ThreadModel[]> {
		let q;
		if (limitCount !== undefined) {
			q = query(collection(this.db, 'threads'), orderBy('createdAt', 'desc'), limit(limitCount));
		} else {
			q = query(collection(this.db, 'threads'), orderBy('createdAt', 'desc'));
		}
		return collectionData(q, {idField: 'id'}) as Observable<ThreadModel[]>;
	}

	listThreadsByUser(uid: string, limitCount?: number): Observable<ThreadModel[]> {
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
	}

	async getUserThreadCount(uid: string): Promise<number> {
		const coll = collection(this.db, 'threads');
		const q = query(coll, where('authorId', '==', uid));
		const snapshot = await getCountFromServer(q);
		console.log(snapshot)
		return snapshot.data().count;
	}


	getThread(id: string): Observable<ThreadModel> {
		const ref = doc(this.db, 'threads', id);
		return docData(ref, {idField: 'id'}) as Observable<ThreadModel>;
	}

	async threadExists(id: string): Promise<boolean> {
		const ref = doc(this.db, 'threads', id);
		const snapshot = await getDoc(ref);
		return snapshot.exists();
	}

	createThread(data: ThreadCreateModel): Observable<any> {
		return from(
			addDoc(collection(this.db, 'threads'), {
				...data,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
				replyCount: 0
			})
		);
	}

	updateThread(id: string, patch: Partial<ThreadModel>): Observable<void> {
		const ref = doc(this.db, 'threads', id);
		return from(
			updateDoc(ref, {
				...patch,
				updatedAt: serverTimestamp()
			})
		);
	}

	deleteThread(id: string): Observable<void> {
		return from(deleteDoc(doc(this.db, 'threads', id)));
	}
}
