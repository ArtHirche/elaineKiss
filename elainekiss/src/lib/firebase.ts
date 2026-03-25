import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBG594IJhYtAz1q4VZ0GJUnfUroUpgQHq4",
  authDomain: "elainekiss-4884f.firebaseapp.com",
  projectId: "elainekiss-4884f",
  storageBucket: "elainekiss-4884f.firebasestorage.app",
  messagingSenderId: "826611305764",
  appId: "1:826611305764:web:3ed1b6df1630f5bcb9b7b1",
};

console.log('Firebase config loaded');

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
