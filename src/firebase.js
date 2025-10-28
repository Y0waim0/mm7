import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_iWuN_-g2ETyeWfjHuBKec6xcoIt3v2w",
  authDomain: "mental-maths7.firebaseapp.com",
  projectId: "mental-maths7",
  storageBucket: "mental-maths7.firebasestorage.app",
  messagingSenderId: "923985373311",
  appId: "1:923985373311:web:7a3284bc51e9317895b74a",
  measurementId: "G-6XDNDFNY59"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);