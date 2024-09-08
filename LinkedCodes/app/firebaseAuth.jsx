// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyACLcDYK4lKrHdwbBnJy2Omp4dJq3Uq3M0",
    authDomain: "linkedcodes-8471e.firebaseapp.com",
    projectId: "linkedcodes-8471e",
    storageBucket: "linkedcodes-8471e.appspot.com",
    messagingSenderId: "944835394186",
    appId: "1:944835394186:web:c5e1d3dd237f5f05c6cb73",
    measurementId: "G-WC04VJZ3V2"
};
// const analytics = getAnalytics(app);

// Initialize Firebase
const app = initializeApp(firebaseConfig);