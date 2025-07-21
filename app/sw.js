import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

// PWA: clean old caches & precache new assets
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// Auto-update & claim control immediately
self.skipWaiting()
clientsClaim()

// Firebase Cloud Messaging
import firebase from 'firebase/compat/app'
import 'firebase/compat/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyDBMCkuDPNJDHNqN1hPjzgkE2kKF9ehkuM",
  authDomain: "nativityofthemotherofgod.firebaseapp.com",
  projectId: "nativityofthemotherofgod",
  storageBucket: "nativityofthemotherofgod.firebasestorage.app",
  messagingSenderId: "85083197535",
  appId: "1:85083197535:web:56f870e083fc3a69828bea",
  measurementId: "G-ZQ740X8RFC"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

try {
  const messaging = firebase.messaging()

  messaging.onBackgroundMessage((payload) => {
    console.log('[sw.ts] 🔔 Background FCM received:', payload)

    const title = payload?.notification?.title || 'Notification'
    const options = {
      body: payload?.notification?.body || '',
      icon: payload?.notification?.icon || '/icons/icon-96x96.png',
      tag: payload?.messageId || 'default-tag', // Use messageId as tag to prevent duplicates
      requireInteraction: true,
      data: payload?.data || {}
    }

    // Only show notification if it's actually a background message
    // (app is not visible/focused)
    return self.registration.showNotification(title, options)
  })
} catch (err) {
  console.error('[sw.ts] Firebase messaging init error:', err)
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[sw.ts] Notification click received.')
  
  event.notification.close()
  
  // Handle click actions
  const urlToOpen = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      
      // If no window/tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

// OPTIONAL: Respond to skip waiting messages (for prompt update)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})