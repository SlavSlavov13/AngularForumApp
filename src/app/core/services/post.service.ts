import {Injectable, Injector, runInInjectionContext} from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getDoc, orderBy, query, serverTimestamp, updateDoc, where,} from '@angular/fire/firestore';
import {from, Observable} from 'rxjs';
import {PostCreateModel, PostModel} from '../../shared/models';
import {ThreadService} from "./thread.service";
import {map, switchMap} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class PostService {
	constructor(
		private db: Firestore,
		private injector: Injector,
		private threadService: ThreadService,
	) {
	}

	listPostsByThread(threadId: string): Observable<PostModel[]> {
		return runInInjectionContext(this.injector, (): Observable<PostModel[]> => {
			const q = query(
				collection(this.db, 'posts'),
				where('threadId', '==', threadId),
				orderBy('createdAt', 'desc')
			);
			return collectionData(q, {idField: 'id'}) as Observable<PostModel[]>;
		});
	}

	listPostsByUser(uid: string): Observable<PostModel[]> {
		return runInInjectionContext(this.injector, (): Observable<PostModel[]> => {
			const q = query(
				collection(this.db, 'posts'),
				where('authorId', '==', uid),
				orderBy('createdAt', 'desc')
			);
			return collectionData(q, {idField: 'id'}) as Observable<PostModel[]>;
		});
	}

	getPost(id: string): Observable<PostModel> {
		return runInInjectionContext(this.injector, (): Observable<PostModel> => {
			const ref = doc(this.db, 'posts', id);
			return docData(ref, {idField: 'id'}) as Observable<PostModel>;
		});
	}

	createPost(data: PostCreateModel): Observable<any> {
		return runInInjectionContext(this.injector, (): Observable<any> => {
			return from(
				addDoc(collection(this.db, 'posts'), {
					...data,
					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp(),
				})
			).pipe(
				switchMap((postRef) => this.threadService.incrementReplyCount(data.threadId).pipe(
					map(() => postRef)
				))
			);
		});
	}

	updatePost(id: string, patch: Partial<PostModel>): Observable<void> {
		return runInInjectionContext(this.injector, (): Observable<void> => {
			const ref = doc(this.db, 'posts', id);
			return from(
				updateDoc(ref, {
					...patch,
					updatedAt: serverTimestamp(),
				})
			);
		});
	}

	deletePost(id: string): Observable<void> {
		return runInInjectionContext(this.injector, (): Observable<void> => {
			return from(deleteDoc(doc(this.db, 'posts', id)));
		});
	}

	async postExists(id: string): Promise<boolean> {
		return await runInInjectionContext(this.injector, async (): Promise<boolean> => {
			const ref = doc(this.db, 'posts', id);
			const snapshot = await getDoc(ref);
			return snapshot.exists();
		});

	}
}
