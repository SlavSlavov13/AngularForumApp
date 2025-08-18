import {Injectable, Injector, runInInjectionContext} from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, docData, DocumentData, Firestore, getCountFromServer, getDoc, limit, orderBy, query, serverTimestamp, updateDoc, where} from '@angular/fire/firestore';
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

	listPostsByThread(threadId: string, limitCount?: number): Observable<PostModel[]> {
		return runInInjectionContext(this.injector, (): Observable<PostModel[]> => {
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
			return collectionData(q, {idField: 'id'}) as Observable<PostModel[]>;
		});
	}

	listPostsByUser(uid: string, limitCount?: number): Observable<PostModel[]> {
		return runInInjectionContext(this.injector, (): Observable<PostModel[]> => {
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
			return collectionData(q, {idField: 'id'}) as Observable<PostModel[]>;
		});
	}

	getPost(id: string): Observable<PostModel> {
		return runInInjectionContext(this.injector, (): Observable<PostModel> => {
			const ref = doc(this.db, 'posts', id);
			return docData(ref, {idField: 'id'}) as Observable<PostModel>;
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
			const postRef = doc(this.db, 'posts', id);

			return from(getDoc(postRef)).pipe(
				switchMap((snapshot): Observable<void> => {
					const postData: DocumentData = snapshot.data()!;
					const threadId: string = postData['threadId'];

					return from(deleteDoc(postRef)).pipe(
						switchMap((): Observable<void> => this.threadService.decrementReplyCount(threadId))
					);
				}),
				map(() => void 0)
			);
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
