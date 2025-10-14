// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { APP_CHECK_CONFIG } from "./app/config/app-check.config";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYm3K5L-8CJeyrt9uK7tHbxA5cXP-3LVQ",
  authDomain: "vattuchinhhang-c5952.firebaseapp.com",
  projectId: "vattuchinhhang-c5952",
  storageBucket: "vattuchinhhang-c5952.firebasestorage.app",
  messagingSenderId: "59321878286",
  appId: "1:59321878286:web:315452bb95a805cefa395f",
  measurementId: "G-W04YV73EVN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize App Check with reCAPTCHA Enterprise (Debug mode for development)
let appCheck: any = null;
try {
  // Enable App Check debug token in development so the SDK sends a valid token
  // @ts-ignore
  (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;

  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(APP_CHECK_CONFIG.RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: APP_CHECK_CONFIG.IS_TOKEN_AUTO_REFRESH_ENABLED
  });
  console.log('App Check initialized with reCAPTCHA Enterprise (debug mode)');
} catch (error) {
  console.warn('App Check initialization failed, continuing without App Check:', error);
  appCheck = null;
}

const analytics = getAnalytics(app);
const auth = getAuth(app);
const functions = getFunctions(app);

export { app, analytics, auth, functions, appCheck, firebaseConfig };
