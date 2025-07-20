/// <reference lib="WebWorker" />

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

const config = useRuntimeConfig()

if (!firebase.apps.length) {
  firebase.initializeApp(config.public.firebaseConfig)
}

try {
  const messaging = firebase.messaging()

  messaging.onBackgroundMessage((payload) => {
    console.log('[sw.ts] 🔔 Background FCM received:', payload)

    const title = payload?.notification?.title || 'Notification'
    const options = {
      title: payload?.notification?.title || '',
      body: payload?.notification?.body || '',
    }

    self.registration.showNotification(title, options)
  })
} catch (err) {
  console.error('[sw.ts] Firebase messaging init error:', err)
}

// OPTIONAL: Respond to skip waiting messages (for prompt update)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
