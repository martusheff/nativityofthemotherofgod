import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

let firebaseApp: FirebaseApp | undefined // singleton

export const usePush = () => {
  const config = useRuntimeConfig()

  if (!firebaseApp) {
    firebaseApp = initializeApp(config.public.firebaseConfig)
  }

  const vapidKey = config.public.fcmPublicVapidKey

  const askPermission = async () => {
    if (!process.client) return

    const registration = await navigator.serviceWorker.ready
    console.log('✅ Service Worker registered:', registration)

    const messaging = getMessaging(firebaseApp)

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      throw new Error('Notification permission not granted')
    }

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    })

    console.log('✅ FCM Token:', token)
    return token
  }

const startListening = () => {
  if (!process.client) return

  const messaging = getMessaging(firebaseApp)

  onMessage(messaging, (payload) => {
    console.log('✅ Foreground message:', payload)

    // Show a native Notification *optional*
    if ('Notification' in window) {
      new Notification(payload.notification?.title || '', {
        body: payload.notification?.body || '',
        icon: '/logo.png',
      })
    }

    // Show an in-page JS alert too
    alert(`🔥 Foreground PUSH:\n${payload.notification?.title}\n${payload.notification?.body}`)
  })
}


  return {
    askPermission,
    startListening,
  }
}
