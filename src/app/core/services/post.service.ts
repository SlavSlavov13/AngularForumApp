import {Injectable, Injector, runInInjectionContext} from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getCountFromServer, getDoc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where, WriteBatch, writeBatch} from '@angular/fire/firestore';
import {from, Observable} from 'rxjs';
import {PostCreateModel, PostModel} from '../../shared/models';
import {ThreadService} from "./thread.service";
import {map, switchMap} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class PostService {
	constructor(
		private db: Firestore,
		private injector: Injector,
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

	async createPost(data: PostCreateModel): Promise<Observable<any>> {
		return await runInInjectionContext(this.injector, async (): Promise<Observable<any>> => {
			const threadService: ThreadService = this.injector.get(ThreadService);
			return from(
				addDoc(collection(this.db, 'posts'), {
					...data,
					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp(),
				})
			).pipe(
				switchMap(postRef =>
					threadService.incrementReplyCount(data.threadId).pipe(
						map(() => postRef)
					)
				)
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

	async deletePost(id: string): Promise<Observable<void>> {
		return await runInInjectionContext(this.injector, async (): Promise<Observable<any>> => {

			const threadService: ThreadService = this.injector.get(ThreadService);
			const postRef = doc(this.db, 'posts', id);

			return from(getDoc(postRef)).pipe(
				switchMap(snapshot => {
					const postData = snapshot.data()!;
					const threadId = postData['threadId'];

					return from(deleteDoc(postRef)).pipe(
						switchMap(() => threadService.decrementReplyCount(threadId))
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

	deletePostsByThreadId(threadId: string): Observable<void> {
		return runInInjectionContext(this.injector, (): Observable<void> => {
			const postsRef = collection(this.db, 'posts');
			const q = query(postsRef, where('threadId', '==', threadId));

			return from(getDocs(q)).pipe(
				switchMap(async (postsSnapshot): Promise<void> => {
					const batch: WriteBatch = writeBatch(this.db);
					postsSnapshot.forEach((docSnap): void => {
						batch.delete(docSnap.ref);
					});
					await batch.commit();
				}),
				map((): undefined => void 0)
			);
		});
	}
}