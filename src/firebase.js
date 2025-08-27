// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAyq4k0-lSIUEy70KgyuQhd5mIdOFU-3-M",
  authDomain: "journal-app-9d847.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "journal-app-9d847.firebasestorage.app",
  measurementId: "G-VLV9PRDPS4",
  appId: "1:614253892633:web:b07de8e08bfe1e72a14688",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export these so you can import in other files
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
