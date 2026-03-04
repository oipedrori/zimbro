import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBmdLKxQRhWWdWM5ISxcDCHuyEdq0lq-o",
  authDomain: "zimbro-ia.firebaseapp.com",
  projectId: "zimbro-ia",
  storageBucket: "zimbro-ia.firebasestorage.app",
  messagingSenderId: "326755658556",
  appId: "1:326755658556:web:e111628648211d2a168c39",
  measurementId: "G-FGPB6XD6MP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { app, analytics, auth, googleProvider, db };
