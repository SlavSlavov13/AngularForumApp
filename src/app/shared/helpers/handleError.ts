import {mapFirebaseError} from "./firebaseErrorMapper";
import {FirebaseError} from "firebase/app";

export function handleError(e: unknown): string {
	if (e instanceof FirebaseError) {
		return mapFirebaseError(e);
	} else if (e instanceof Error) {
		return e.message || 'An unexpected error occurred.';
	} else if (typeof e === 'string') {
		return e;
	}
	return 'An unknown error occurred.';
}
