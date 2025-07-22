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
  console.log('[sw.ts] 🔔 Raw Push event received.'); // This is the first log now
  
  // Prevent the browser's default notification display. THIS IS KEY!
  event.preventDefault(); 

  // Parse the data from the push event
  const data = event.data?.json() || {};
  console.log('[sw.ts] Push event data:', data);

  // Extract notification details. If your backend sends a 'notification' field, use it.
  // Otherwise, you might construct it from 'data'.
  const notificationPayload = data.notification || data; // Adjust if your data structure is different

  if (!notificationPayload.title) {
    console.warn('[sw.ts] Push event received without title, not showing notification.');
    return; // Don't show a notification if there's no title
  }

  const title = notificationPayload.title || 'Notification';
  const options = {
    body: notificationPayload.body || '',
    // Keep this icon line if you want an icon for your custom notification,
    // or remove it if you prefer no icon.
    icon: notificationPayload.icon || '/icons/icon-192x192.png', 
    tag: notificationPayload.messageId || 'default-tag', // Use messageId for uniqueness
    requireInteraction: true,
    data: data // Pass original data for click handling
  };

  console.log('[sw.ts] Showing custom notification with options:', options);

  // Display the notification
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
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