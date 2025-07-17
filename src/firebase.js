// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAN2-2b2fMl0jif1xofgV8tZcIS6TL7aoM",
  authDomain: "reboot-cf16f.firebaseapp.com",
  projectId: "reboot-cf16f",
  storageBucket: "reboot-cf16f.firebasestorage.app",
  messagingSenderId: "156390945545",
  appId: "1:156390945545:web:8afaebcf02b8c1c25659d8",
  measurementId: "G-NLYMXNJ4GC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
