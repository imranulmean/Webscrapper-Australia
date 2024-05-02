// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


/////////////////////////////////////
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-4e89d.firebaseapp.com",
  projectId: "mern-estate-4e89d",
  storageBucket: import.meta.env.VITE_FIREBASE_BUCKET,
  messagingSenderId: "11007302888",
  appId: "1:11007302888:web:e3d232a01659511033bd5d"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
