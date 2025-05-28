
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAPTd2dypkAKy9cmmi86IcfB8lCjyU7k4I",
  authDomain: "tripplanner-3895e.firebaseapp.com",
  projectId: "tripplanner-3895e",
  storageBucket: "tripplanner-3895e.firebasestorage.app",
  messagingSenderId: "761664371715",
  appId: "1:761664371715:web:696fdd13b677b58b70e236",
  measurementId: "G-CJPD8F5DRX"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider ,db};