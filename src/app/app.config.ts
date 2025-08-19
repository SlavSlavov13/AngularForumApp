import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {FirebaseApp, initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {Auth, getAuth, provideAuth} from "@angular/fire/auth";
import {Firestore, getFirestore, provideFirestore} from "@angular/fire/firestore";
import {environment} from "../environments/environment";
import {FirebaseStorage, getStorage, provideStorage} from "@angular/fire/storage";
import {provideStore} from "@ngrx/store";
import {loadingReducer} from "./store";
import {provideStoreDevtools} from "@ngrx/store-devtools";
import {provideAnimations} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZoneChangeDetection({eventCoalescing: true}),
		provideRouter(routes),
		provideFirebaseApp((): FirebaseApp => initializeApp(environment.firebase)),
		provideAuth((): Auth => getAuth()),
		provideFirestore((): Firestore => getFirestore()),
		provideStorage((): FirebaseStorage => getStorage()),
		provideStore({loading: loadingReducer}),
		provideStoreDevtools({
			maxAge: 25,
			logOnly: false,
		}),
		provideAnimations(),
	],
};
