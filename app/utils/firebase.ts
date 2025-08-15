import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: "AIzaSyDBMCkuDPNJDHNqN1hPjzgkE2kKF9ehkuM",
  authDomain: "nativityofthemotherofgod.firebaseapp.com",
  projectId: "nativityofthemotherofgod",
  storageBucket: "nativityofthemotherofgod.firebasestorage.app",
  messagingSenderId: "85083197535",
  appId: "1:85083197535:web:56f870e083fc3a69828bea",
  measurementId: "G-ZQ740X8RFC"
}

// Initialize Firebase, ensuring a single app instance
const app: FirebaseApp = getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db, messaging }