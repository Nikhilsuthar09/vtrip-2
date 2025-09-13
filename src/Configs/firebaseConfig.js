import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAVY2grK625mlxF6Lzd3exdLCT8kYwYh7o",
  authDomain: "vtrip-2955d.firebaseapp.com",
  projectId: "vtrip-2955d",
  storageBucket: "vtrip-2955d.firebasestorage.app",
  messagingSenderId: "197827908579",
  appId: "1:197827908579:web:8b648c844bb7a1506b46d6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
export { auth, db };
export default app;
