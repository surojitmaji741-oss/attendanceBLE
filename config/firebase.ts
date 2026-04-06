// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARPE7m0knmGyO79BOsqTSAT6ik7qnxnlw",
  authDomain: "attendanceble-cf377.firebaseapp.com",
  projectId: "attendanceble-cf377",
  storageBucket: "attendanceble-cf377.firebasestorage.app",
  messagingSenderId: "186005979002",
  appId: "1:186005979002:web:9c3438d29e154de1c9e0c3",
  measurementId: "G-DR3E2E6KLE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);