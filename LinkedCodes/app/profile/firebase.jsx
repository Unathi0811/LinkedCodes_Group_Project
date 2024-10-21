// firebase.js
import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importing Storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration object
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
let app;
try {
  // Check if any apps have already been initialized
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp(); // Use the existing app instance
  }
} catch (error) {
  console.error("Firebase initialization error", error);
}

// Initialize Firebase Authentication with React Native persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Storage

// Exporting auth, db, and storage for use in other files
export { auth, db, storage };
