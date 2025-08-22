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

self.addEventListener('push', (event) => {
  // console.log('[sw.ts] Push event received.'); // This is the first log now
  
  // Prevent the browser's default notification display. 
  // This prevents multiple notifications from being sent.
  event.preventDefault(); 

  const data = event.data?.json() || {};
  // console.log('[sw.ts] Push event data:', data);
  const notificationPayload = data.notification || data;

  if (!notificationPayload.title) {
    console.warn('[sw.ts] Push event received without title, not showing notification.');
    return; // Don't show a notification if there's no title
  }

  const title = notificationPayload.title;

  const options = {
    body: notificationPayload.body || '',
    icon: notificationPayload.icon || '/icons/icon-192x192.png', 
    tag: notificationPayload.messageId || 'default-tag',
    requireInteraction: true,
    data: data
  };

  // console.log('[sw.ts] Showing custom notification with options:', options);

  // Display the notification.
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const urlToOpen = '/schedule'
  
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