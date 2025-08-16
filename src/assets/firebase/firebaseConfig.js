import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzVN3pZqGrni0J4OoVUU4v6L-p6dUgMgM",
  authDomain: "mirrorapp-e95f0.firebaseapp.com",
  projectId: "mirrorapp-e95f0",
  storageBucket: "mirrorapp-e95f0.appspot.com",
  messagingSenderId: "1054032948576",
  appId: "1:1054032948576:web:cb0eaff35278b6257e8205",
  measurementId: "G-ERMJK6NSWS"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);
export { app, auth, db };