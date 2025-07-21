import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { app } from '~/utils/firebase'

export const usePush = () => {
  const vapidKey = "BIa_tnRFKmOdjpbFMjpUMaWd0V8SB5jjVMX6z4OVtVg_HfeQ4jzKiFiFkQRPq-CGoAeHsuTXamsZgjveHzrYKco"

  const askPermission = async () => {
    if (!process.client) return null

    try {
      const registration = await navigator.serviceWorker.ready
      console.log('✅ Service Worker registered:', registration)

      const messaging = getMessaging(app)
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        console.warn('Notification permission not granted')
        return null
      }

      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      })
      console.log('✅ FCM Token:', token)
      return token
    } catch (error) {
      console.error('Push permission error:', error)
      return null
    }
  }

  const startListening = () => {
    if (!process.client) return

    const messaging = getMessaging(app)
    onMessage(messaging, (payload) => {
      console.log('✅ Foreground message:', payload)
      if ('Notification' in window && payload.notification) {
        new Notification(payload.notification.title || 'Notification', {
          body: payload.notification.body || '',
          icon: '/logo.png',
        })
      }
    })
  }

  return {
    askPermission,
    startListening,
  }
}