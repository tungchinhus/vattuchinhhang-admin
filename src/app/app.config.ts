import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './firebase.config';
import { FIREBASE_APP, FIRESTORE, FIREBASE_STORAGE } from './firebase.tokens';

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
    { provide: FIREBASE_STORAGE, useFactory: (app: FirebaseApp) => getStorage(app), deps: [FIREBASE_APP] }
  ]
};