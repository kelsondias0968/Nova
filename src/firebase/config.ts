import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCmn_692bncnd5AqCm4URJFj0rBsSnrai0",
  authDomain: "sample-firebase-ai-app-221e6.firebaseapp.com",
  projectId: "sample-firebase-ai-app-221e6",
  storageBucket: "sample-firebase-ai-app-221e6.firebasestorage.app",
  messagingSenderId: "1644754894",
  appId: "1:1644754894:web:89f299bc5a903bac44dd9f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
