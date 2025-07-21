import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'


export const firebaseConfig = {
  apiKey: "AIzaSyDBMCkuDPNJDHNqN1hPjzgkE2kKF9ehkuM",
  authDomain: "nativityofthemotherofgod.firebaseapp.com",
  projectId: "nativityofthemotherofgod",
  storageBucket: "nativityofthemotherofgod.firebasestorage.app",
  messagingSenderId: "85083197535",
  appId: "1:85083197535:web:56f870e083fc3a69828bea",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

// Initialize Firestore
const db = getFirestore(app)

// Initialize Messaging (for notifications)
let messaging: any = null
if (typeof window !== 'undefined') {
  messaging = getMessaging(app)
}

// Development emulator connections (optional)
if (process.env.NODE_ENV === 'development') {
  // Uncomment these lines if you're using Firebase emulators
  // connectAuthEmulator(auth, 'http://localhost:9099')
  // connectFirestoreEmulator(db, 'localhost', 8080)
}

export { auth, db, messaging }