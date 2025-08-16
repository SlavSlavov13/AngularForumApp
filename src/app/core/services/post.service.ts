import {inject, Injectable} from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, orderBy, query, serverTimestamp, updateDoc, where,} from '@angular/fire/firestore';
import {from, Observable} from 'rxjs';
import {PostCreateModel, PostModel} from '../../shared/models';

@Injectable({providedIn: 'root'})
export class PostService {
	private db: Firestore = inject(Firestore);

	listPostsByThread(threadId: string): Observable<PostModel[]> {
		const q = query(
			collection(this.db, 'posts'),
			where('threadId', '==', threadId),
			orderBy('createdAt', 'desc')
		);
		return collectionData(q, {idField: 'id'}) as Observable<PostModel[]>;
	}

	listPostsByUser(uid: string): Observable<PostModel[]> {
		const q = query(
			collection(this.db, 'posts'),
			where('authorId', '==', uid),
			orderBy('createdAt', 'desc')
		);
		return collectionData(q, {idField: 'id'}) as Observable<PostModel[]>;
	}

	getPost(id: string): Observable<PostModel> {
		const ref = doc(this.db, 'posts', id);
		return docData(ref, {idField: 'id'}) as Observable<PostModel>;
	}

	createPost(data: PostCreateModel): Observable<any> {
		return from(
			addDoc(collection(this.db, 'posts'), {
				...data,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			})
		);
	}

	updatePost(id: string, patch: Partial<PostModel>): Observable<void> {
		const ref = doc(this.db, 'posts', id);
		return from(
			updateDoc(ref, {
				...patch,
				updatedAt: serverTimestamp(),
			})
		);
	}

	deletePost(id: string): Observable<void> {
		return from(deleteDoc(doc(this.db, 'posts', id)));
	}
}
