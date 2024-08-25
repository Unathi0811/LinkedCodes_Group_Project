import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
    apiKey: "AIzaSyACLcDYK4lKrHdwbBnJy2Omp4dJq3Uq3M0",
    authDomain: "linkedcodes-8471e.firebaseapp.com",
    projectId: "linkedcodes-8471e",
    storageBucket: "linkedcodes-8471e.appspot.com",
    messagingSenderId: "944835394186",
    appId: "1:944835394186:web:c5e1d3dd237f5f05c6cb73",
    measurementId: "G-WC04VJZ3V2",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
