import {FirebaseError} from "firebase/app";

export function mapFirebaseError(error: unknown): string {
	if (!(error instanceof FirebaseError)) {
		return 'An unexpected error occurred.';
	}

	const errorMap: { [key: string]: string } = {
		// Authentication Errors
		'auth/app-deleted': 'This app has been deleted and is no longer available.',
		'auth/app-not-authorized': 'This app is not authorized to use Firebase Authentication. Please contact support.',
		'auth/argument-error': 'Invalid input provided. Please check and try again.',
		'auth/invalid-api-key': 'The API key is invalid. Please check your configuration.',
		'auth/invalid-user-token': 'Your session has expired. Please log in again.',
		'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
		'auth/operation-not-allowed': 'This operation is currently not allowed.',
		'auth/requires-recent-login': 'For security reasons, please log out and log back in to proceed.',
		'auth/too-many-requests': 'Too many login attempts detected. Please wait a moment and try again.',
		'auth/unauthorized-domain': 'Access from this domain is not authorized. Please contact support.',
		'auth/user-disabled': 'Your account has been disabled. Please contact support if you believe this is an error.',
		'auth/user-not-found': 'No account found with this email or password.',
		'auth/wrong-password': 'The password you entered is incorrect. Please try again.',
		'auth/email-already-in-use': 'This email address is already in use. Please use a different email.',
		'auth/invalid-email': 'Please enter a valid email address.',
		'auth/weak-password': 'Your password is too weak. Please choose a stronger password.',
		'auth/provider-already-linked': 'This provider is already linked to your account.',
		'auth/no-such-provider': 'No linked account found for this provider.',
		'auth/credential-already-in-use': 'This credential is already associated with another account. Please use a different one.',
		'auth/account-exists-with-different-credential': 'An account already exists with this email but different sign-in credentials. Please use the correct sign-in method.',
		'auth/invalid-credential': 'The authentication credential is invalid or expired. Please try again.',
		'auth/cancelled-popup-request': 'The popup was closed before the process completed.',
		'auth/popup-blocked': 'The popup was blocked by your browser. Please allow popups and try again.',
		'auth/popup-closed-by-user': 'The popup was closed before the operation completed.',
		'auth/operation-not-supported-in-this-environment': 'This operation is not supported in your environment.',

		// Firestore Errors
		'permission-denied': 'You don’t have permission to perform this action.',
		'unavailable': 'Service is temporarily unavailable. Please try again shortly.',
		'deadline-exceeded': 'The request timed out. Please try again.',
		'resource-exhausted': 'Resource limits exceeded. Please try again later.',
		'aborted': 'Operation aborted. Please retry.',
		'not-found': 'The requested data could not be found.',
		'already-exists': 'This data already exists.',
		'invalid-argument': 'Invalid input provided. Please check and try again.',
		'internal': 'Internal server error. Please try again later.',
		'unauthenticated': 'Authentication required. Please log in.',
		'data-loss': 'An unexpected error occurred. Please try again.',

		// Firebase Storage Errors
		'storage/object-not-found': 'The file you are looking for does not exist.',
		'storage/unauthorized': 'You are not authorized to access this file.',
		'storage/canceled': 'The operation was canceled.',
		'storage/unknown': 'An unknown storage error occurred.',
		'storage/retry-limit-exceeded': 'Retry limit exceeded. Please try again later.',
		'storage/quota-exceeded': 'Storage limit exceeded. Please free up space or upgrade your plan.',

		// Common error fallback
		'default': error.message || 'An unknown error occurred. Please try again.'
	};

	return errorMap[error.code] || errorMap['default'];
}
