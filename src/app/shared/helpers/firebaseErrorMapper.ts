import {FirebaseError} from "firebase/app";

export function mapFirebaseError(error: unknown): string {
	if (!(error instanceof FirebaseError)) {
		return 'An unexpected error occurred.';
	}

	const errorMap: { [key: string]: string } = {
		// Authentication Errors
		'auth/app-deleted': 'This app has been deleted.',
		'auth/app-not-authorized': 'This app is not authorized to use Firebase Authentication.',
		'auth/argument-error': 'Invalid arguments provided.',
		'auth/invalid-api-key': 'The API key provided is invalid.',
		'auth/invalid-user-token': 'The user\'s credential is no longer valid. Please log in again.',
		'auth/network-request-failed': 'Network error. Please check your connection.',
		'auth/operation-not-allowed': 'This operation is not allowed.',
		'auth/requires-recent-login': 'Please log out and back in before making this change.',
		'auth/too-many-requests': 'Too many login attempts. Please try again later.',
		'auth/unauthorized-domain': 'Unauthorized domain. Please check your app configuration.',
		'auth/user-disabled': 'This user account is disabled.',
		'auth/user-not-found': 'No user found with these credentials.',
		'auth/wrong-password': 'Incorrect password.',
		'auth/email-already-in-use': 'This email address is already registered.',
		'auth/invalid-email': 'Please enter a valid email address.',
		'auth/weak-password': 'The password is too weak.',
		'auth/provider-already-linked': 'This provider is already linked to the user.',
		'auth/no-such-provider': 'No such provider is linked.',
		'auth/credential-already-in-use': 'This credential is already associated with a different user account.',
		'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials.',
		'auth/invalid-credential': 'The supplied auth credential is malformed or has expired.',
		'auth/cancelled-popup-request': 'The popup has been closed before completion.',
		'auth/popup-blocked': 'The popup was blocked by the browser.',
		'auth/popup-closed-by-user': 'The popup has been closed by the user before completion.',
		'auth/operation-not-supported-in-this-environment': 'This operation is not supported in this environment.',

		// Firestore Errors
		'permission-denied': 'You do not have permission to perform this action.',
		'unavailable': 'Service temporarily unavailable. Please try again later.',
		'deadline-exceeded': 'Request timed out. Please try again.',
		'resource-exhausted': 'Resource quota exceeded. Please try again later.',
		'aborted': 'Operation aborted. Please retry.',
		'not-found': 'Requested data not found.',
		'already-exists': 'Data already exists.',
		'invalid-argument': 'Invalid arguments provided.',
		'internal': 'Internal server error. Please try again later.',
		'unauthenticated': 'Authentication required. Please log in.',
		'data-loss': 'Unexpected data loss occurred.',

		// Firebase Storage Errors
		'storage/object-not-found': 'File does not exist.',
		'storage/unauthorized': 'You are not authorized to access this file.',
		'storage/canceled': 'The operation was canceled.',
		'storage/unknown': 'An unknown storage error occurred.',
		'storage/retry-limit-exceeded': 'Retry limit exceeded. Please try again later.',
		'storage/quota-exceeded': 'Storage quota exceeded. Please free up space or upgrade your plan.',

		// Common error fallback
		'default': error.message || 'An unknown error occurred. Please try again.'
	};

	return errorMap[error.code] || errorMap['default'];
}