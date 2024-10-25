const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyACLcDYK4lKrHdwbBnJy2Omp4dJq3Uq3M0",
  authDomain: "linkedcodes-8471e.firebaseapp.com",
  projectId: "linkedcodes-8471e",
  storageBucket: "linkedcodes-8471e.appspot.com",
  messagingSenderId: "944835394186",
  appId: "1:944835394186:web:c5e1d3dd237f5f05c6cb73",
  measurementId: "G-WC04VJZ3V2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

module.exports = { db };
