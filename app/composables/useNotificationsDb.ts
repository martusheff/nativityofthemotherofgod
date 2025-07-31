// ~/composables/useNotificationsDb.ts

import { useFirestore } from './useFirestore'
import { useFirebaseAuth } from './useFirebaseAuth'
import { serverTimestamp } from 'firebase/firestore'

// Type definitions
interface TokenData {
  fcmToken: string
  updatedAt: any // Firebase Timestamp
  userAgent: string
  lastSeen: any // Firebase Timestamp
}

interface NotificationTokens {
  [deviceId: string]: TokenData
}

interface UserNotifications {
  enabled: boolean
  tokens: NotificationTokens
  preferences?: any
  updatedAt: any // Firebase Timestamp
}

export const useNotificationsDb = () => {
  const { getDocByPath, setDocByPath, deleteDocByPath, updateDocByPath } = useFirestore()
  const { user } = useFirebaseAuth()

  // Generate a unique device ID (you might want to store this in localStorage)
  const generateDeviceId = () => {
    // Check if we already have a device ID in localStorage
    if (typeof window !== 'undefined') {
      let deviceId = localStorage.getItem('deviceId')
      if (!deviceId) {
        deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('deviceId', deviceId)
      }
      return deviceId
    }
    // Fallback for server-side
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const saveUserToken = async (token: string) => {
    if (!user.value) throw new Error('No user logged in')

    const deviceId = generateDeviceId()
    const path = `users/${user.value.uid}`
    
    // Get current user data
    const userData = await getDocByPath(path)
    const existingNotifications = (userData?.notifications || {}) as Partial<UserNotifications>
    const existingTokens: NotificationTokens = existingNotifications.tokens || {}

    // Add or update the token for this device
    const updatedTokens: NotificationTokens = {
      ...existingTokens,
      [deviceId]: {
        fcmToken: token,
        updatedAt: serverTimestamp(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
        lastSeen: serverTimestamp()
      }
    }

    // Use setDocByPath instead of updateDocByPath to handle new documents
    await setDocByPath(path, {
      ...userData, // Preserve existing user data
      notifications: {
        ...existingNotifications,
        enabled: true,
        tokens: updatedTokens,
        updatedAt: serverTimestamp()
      }
    })

    return deviceId
  }

  const removeDeviceToken = async (deviceId?: string) => {
    if (!user.value) throw new Error('No user logged in')

    const targetDeviceId = deviceId || generateDeviceId()
    // console.log('Removing device token for deviceId:', targetDeviceId)
    const path = `users/${user.value.uid}`
    
    const userData = await getDocByPath(path)
    const existingNotifications = (userData?.notifications || {}) as Partial<UserNotifications>
    const existingTokens: NotificationTokens = existingNotifications.tokens || {}

    // Remove the specific device token
    const updatedTokens: NotificationTokens = { ...existingTokens }
    // console.log('Before removal, existing tokens:', Object.keys(existingTokens))
    delete updatedTokens[targetDeviceId]
    // console.log('After removal, updated tokens:', Object.keys(updatedTokens))

    // Use setDocByPath to ensure the document exists
    await setDocByPath(path, {
      ...userData, // Preserve existing user data
      notifications: {
        ...existingNotifications,
        tokens: updatedTokens,
        updatedAt: serverTimestamp()
      }
    })
  }

  const disableUserNotifications = async () => {
    if (!user.value) throw new Error('No user logged in')

    const path = `users/${user.value.uid}`
    const userData = await getDocByPath(path)
    
    // Use setDocByPath to ensure the document exists
    await setDocByPath(path, {
      ...userData, // Preserve existing user data
      notifications: {
        enabled: false,
        tokens: {},
        updatedAt: serverTimestamp()
      }
    })
  }

  const getUserNotifications = async () => {
    if (!user.value) throw new Error('No user logged in')

    const path = `users/${user.value.uid}`
    const userData = await getDocByPath(path)
    return userData?.notifications || null
  }

  const getCurrentDeviceToken = async () => {
    if (!user.value) throw new Error('No user logged in')

    const deviceId = generateDeviceId()
    const notifications = await getUserNotifications()
    
    return notifications?.tokens?.[deviceId] || null
  }

  const getAllDeviceTokens = async (): Promise<NotificationTokens> => {
    if (!user.value) throw new Error('No user logged in')

    const notifications = await getUserNotifications()
    return (notifications?.tokens || {}) as NotificationTokens
  }

  const cleanupOldTokens = async (daysOld = 30): Promise<number> => {
    if (!user.value) throw new Error('No user logged in')

    const path = `users/${user.value.uid}`
    const userData = await getDocByPath(path)
    const existingNotifications = (userData?.notifications || {}) as Partial<UserNotifications>
    const existingTokens: NotificationTokens = existingNotifications.tokens || {}

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const activeTokens: NotificationTokens = {}
    for (const [deviceId, tokenData] of Object.entries(existingTokens)) {
      const lastSeen = tokenData.lastSeen?.toDate ? tokenData.lastSeen.toDate() : new Date(tokenData.lastSeen)
      if (lastSeen > cutoffDate) {
        activeTokens[deviceId] = tokenData
      }
    }

    // Use setDocByPath to ensure the document exists
    await setDocByPath(path, {
      ...userData, // Preserve existing user data
      notifications: {
        ...existingNotifications,
        tokens: activeTokens,
        updatedAt: serverTimestamp()
      }
    })

    return Object.keys(existingTokens).length - Object.keys(activeTokens).length // Return count of removed tokens
  }

  const saveUserNotificationPreferences = async (preferences: any) => {
    if (!user.value) throw new Error('No user logged in')

    const path = `users/${user.value.uid}`
    const userData = await getDocByPath(path)
    
    // Use setDocByPath to ensure the document exists
    await setDocByPath(path, {
      ...userData, // Preserve existing user data
      notifications: {
        ...userData?.notifications,
        preferences,
        updatedAt: serverTimestamp()
      }
    })
  }

  return {
    saveUserToken,
    removeDeviceToken,
    disableUserNotifications,
    getUserNotifications,
    getCurrentDeviceToken,
    getAllDeviceTokens,
    cleanupOldTokens,
    saveUserNotificationPreferences,
    generateDeviceId
  }
}