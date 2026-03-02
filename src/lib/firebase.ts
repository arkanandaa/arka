import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDipg3M-2X8IPm-xLV-cr0lDaiEv79ttao",
  authDomain: "arka-a6948.firebaseapp.com",
  projectId: "arka-a6948",
  storageBucket: "arka-a6948.firebasestorage.app",
  messagingSenderId: "210274725799",
  appId: "1:210274725799:web:ab47325a45332417b2d082"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
