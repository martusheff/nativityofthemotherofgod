// ~/composables/useNotificationsDb.ts

import { useFirestore } from './useFirestore'
import { useFirebaseAuth } from './useFirebaseAuth'
import { serverTimestamp } from 'firebase/firestore'

export const useNotificationsDb = () => {
  const { getDocByPath, setDocByPath, deleteDocByPath, updateDocByPath } = useFirestore()
  const { user } = useFirebaseAuth()

  const saveUserToken = async (token: string) => {
    if (!user.value) throw new Error('No user logged in')

    // Store notifications data directly in the user document
    const path = `users/${user.value.uid}`
    await setDocByPath(path, {
      notifications: {
        fcmToken: token,
        enabled: true,
        updatedAt: serverTimestamp()
      }
    })
  }

  const disableUserNotifications = async () => {
    if (!user.value) throw new Error('No user logged in')

    // Remove the notifications field from the user document
    const path = `users/${user.value.uid}`
    await updateDocByPath(path, {
      notifications: null
    })
  }

  const getUserNotifications = async () => {
    if (!user.value) throw new Error('No user logged in')

    const path = `users/${user.value.uid}`
    const userData = await getDocByPath(path)
    return userData?.notifications || null
  }

  const saveUserNotificationPreferences = async (preferences: any) => {
    if (!user.value) throw new Error('No user logged in')

    const path = `users/${user.value.uid}`
    const userData = await getDocByPath(path)
    
    await setDocByPath(path, {
      notifications: {
        ...userData?.notifications,
        preferences,
        updatedAt: serverTimestamp()
      }
    })
  }

  return {
    saveUserToken,
    disableUserNotifications,
    getUserNotifications,
    saveUserNotificationPreferences
  }
}