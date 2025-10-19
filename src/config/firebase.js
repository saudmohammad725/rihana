import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvem4m98qDEuVzg4XQP-MtwndE_buKnq4",
  authDomain: "rihana-9e001.firebaseapp.com",
  projectId: "rihana-9e001",
  storageBucket: "rihana-9e001.firebasestorage.app",
  messagingSenderId: "494667952255",
  appId: "1:494667952255:web:8e661b7d2bd87b8a5e8f4a"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app

