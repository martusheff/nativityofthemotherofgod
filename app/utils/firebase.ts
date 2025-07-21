import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'


export const firebaseConfig = {
  apiKey: "AIzaSyDJhu0HllKsqnAWT3gFyKm_ndr-AdQJzts",
  authDomain: "testpwa-9f6ad.firebaseapp.com",
  projectId: "testpwa-9f6ad",
  storageBucket: "testpwa-9f6ad.firebasestorage.app",
  messagingSenderId: "631863609293",
  appId: "1:631863609293:web:483a0c6c52fd594d0f6684",
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