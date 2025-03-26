// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNyFGeJVEtQ7FwcXJe90s5jVhjilD36TE",
  authDomain: "ia-events-d5a7c.firebaseapp.com",
  projectId: "ia-events-d5a7c",
  storageBucket: "ia-events-d5a7c.firebasestorage.app",
  messagingSenderId: "650175880",
  appId: "1:650175880:web:6a7ad37ece7b699617463d",
  measurementId: "G-RGHXPTCZMM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);