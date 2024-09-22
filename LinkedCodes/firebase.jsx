import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence  } from "firebase/auth";
import { getStorage } from "firebase/storage";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyACLcDYK4lKrHdwbBnJy2Omp4dJq3Uq3M0",
    authDomain: "linkedcodes-8471e.firebaseapp.com",
    projectId: "linkedcodes-8471e",
    storageBucket: "linkedcodes-8471e.appspot.com",
    messagingSenderId: "944835394186",
    appId: "1:944835394186:web:c5e1d3dd237f5f05c6cb73",
    measurementId: "G-WC04VJZ3V2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);