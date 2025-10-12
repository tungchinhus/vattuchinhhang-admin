import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, signInAnonymously, type Auth } from 'firebase/auth';
import { firebaseConfig } from './firebase.config';
import { FIREBASE_APP, FIRESTORE, FIREBASE_STORAGE, FIREBASE_AUTH } from './firebase.tokens';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    { provide: FIREBASE_APP, useFactory: () => initializeApp(firebaseConfig) },
    { provide: FIRESTORE, useFactory: (app: FirebaseApp) => getFirestore(app), deps: [FIREBASE_APP] },
    { provide: FIREBASE_STORAGE, useFactory: (app: FirebaseApp) => getStorage(app), deps: [FIREBASE_APP] },
    { provide: FIREBASE_AUTH, useFactory: (app: FirebaseApp) => getAuth(app), deps: [FIREBASE_APP] },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [FIREBASE_AUTH],
      useFactory: (auth: Auth) => () =>
        // Ensure there is always an authenticated Firebase user (anonymous) for Firestore rules
        signInAnonymously(auth).catch(() => undefined)
    }
  ]
};