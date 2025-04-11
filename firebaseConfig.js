// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdYBe6SBVJbjqjJNAN3JLh9-3P-I11FbY",
  authDomain: "databasesfirebase-804f6.firebaseapp.com",
  projectId: "databasesfirebase-804f6",
  storageBucket: "databasesfirebase-804f6.appspot.com",
  messagingSenderId: "533378479127",
  appId: "1:533378479127:web:e75cfe61ba3e58676c5852",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
