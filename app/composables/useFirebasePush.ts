import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { app } from '~/utils/firebase'

export const useFirebasePush = () => {
  const vapidKey = "BIa_tnRFKmOdjpbFMjpUMaWd0V8SB5jjVMX6z4OVtVg_HfeQ4jzKiFiFkQRPq-CGoAeHsuTXamsZgjveHzrYKco"

  const askPermission = async () => {
    if (!process.client) return null

    try {
      const registration = await navigator.serviceWorker.ready
      // console.log('✅ Service Worker registered:', registration)

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
      // console.log('✅ FCM Token:', token)
      return token
    } catch (error) {
      console.error('Push permission error:', error)
      return null
    }
  }

  const getExistingToken = async () => {
    if (!process.client) return null

    try {
      // First check if permission is granted
      if (Notification.permission !== 'granted') {
        return null
      }

      const registration = await navigator.serviceWorker.ready
      const messaging = getMessaging(app)
      
      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      })
      
      // console.log('✅ Existing FCM Token:', token)
      return token
    } catch (error) {
      console.error('Error getting existing token:', error)
      return null
    }
  }

  const getPermissionStatus = () => {
    if (!process.client || !('Notification' in window)) return 'unsupported'
    return Notification.permission
  }

  const resetPermissions = () => {
    // Note: Browsers don't allow programmatic permission reset
    // This provides instructions to the user
    const instructions = {
      chrome: 'Click the lock icon in the address bar, then reset notifications',
      firefox: 'Click the shield icon, then manage permissions',
      safari: 'Go to Safari > Preferences > Websites > Notifications',
      general: 'Go to your browser settings and reset notification permissions for this site'
    }
    
    const userAgent = navigator.userAgent.toLowerCase()
    let instruction = instructions.general
    
    if (userAgent.includes('chrome')) instruction = instructions.chrome
    else if (userAgent.includes('firefox')) instruction = instructions.firefox  
    else if (userAgent.includes('safari')) instruction = instructions.safari
    
    return instruction
  }

  const startListening = () => {
    if (!process.client) return
    
    const messaging = getMessaging(app)
    onMessage(messaging, (payload) => {
      // console.log('✅ Foreground message:', payload)
      
      // Check if the page is actually visible/focused
      // onMessage should only fire when app is in foreground, but mobile browsers can be tricky
      if (document.hidden || document.visibilityState !== 'visible') {
        // console.log('Page not visible, letting service worker handle notification')
        return
      }
      
      // Check if notifications are supported and permission is granted
      if ('Notification' in window && Notification.permission === 'granted' && payload.notification) {
        // Option 1: Use browser Notification API (works when page is visible)
        const notification = new Notification(payload.notification.title || 'Notification', {
          body: payload.notification.body || '',
          icon: payload.notification.icon || '/icons/icon-96x96.png', // Add an icon if you have one
          tag: payload.messageId, // Prevents duplicate notifications
          requireInteraction: true, // Keeps notification visible until user interacts
          data: payload.data
        })

        // Handle notification click
        notification.onclick = (event) => {
          event.preventDefault()
          window.focus() // Focus the window
          notification.close()
          
          // Handle any click actions based on payload.data
          if (payload.data?.url) {
            window.location.href = payload.data.url
          }
        }
      }
      
      // Option 2: Also show an in-app notification/toast
      // This ensures the user sees something even if browser notifications fail
      showInAppNotification(payload.notification)
    })
  }

  // Helper function to show in-app notification
  const showInAppNotification = (notification: { title?: string; body?: string; icon?: string; badge?: string } | undefined) => {
    // Create a simple toast notification that appears on the page
    const toast = document.createElement('div')
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    `
    
    // Add CSS animation
    if (!document.querySelector('#toast-styles')) {
      const style = document.createElement('style')
      style.id = 'toast-styles'
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `
      document.head.appendChild(style)
    }

    toast.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">${notification?.title || 'Notification'}</div>
      <div style="font-size: 14px; opacity: 0.9;">${notification?.body || ''}</div>
    `

    document.body.appendChild(toast)

    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease-out reverse'
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }, 5000)

    // Remove on click
    toast.addEventListener('click', () => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    })
  }

  return {
    askPermission,
    startListening,
    getExistingToken,
    getPermissionStatus,
    resetPermissions,
  }
}