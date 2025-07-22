// stores/notifications.ts
import { defineStore } from 'pinia'

interface NotificationPreferences {
  serviceReminders: boolean
}

interface NotificationState {
  preferences: NotificationPreferences
  token: string | null
  serverToken: string | null
  permissionStatus: 'default' | 'granted' | 'denied' | 'unsupported'
  lastFetched: number | null
  isLoading: boolean
  error: string | null
  saveMessage: string | null
}

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000

export const useNotificationsStore = defineStore('notifications', () => {
  // State
  const preferences = ref<NotificationPreferences>({
    serviceReminders: true,
  })
  const token = ref<string | null>(null)
  const serverToken = ref<string | null>(null)
  const permissionStatus = ref<'default' | 'granted' | 'denied' | 'unsupported'>('default')
  const lastFetched = ref<number | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const saveMessage = ref<string | null>(null)

  // Getters
  const isTokenSynced = computed(() => {
    return token.value && serverToken.value && token.value === serverToken.value
  })
  
  const shouldShowOutOfSync = computed(() => {
    return lastFetched.value !== null && token.value && !isTokenSynced.value
  })
  
  const canModifyNotifications = computed(() => {
    const { isAuthenticated } = useFirebaseAuth()
    return permissionStatus.value === 'granted' && isTokenSynced.value && isAuthenticated.value
  })
  
  const isCacheStale = computed(() => {
    if (!lastFetched.value) return true
    return Date.now() - lastFetched.value > CACHE_DURATION
  })
  
  const needsRefresh = computed(() => {
    const { isAuthenticated } = useFirebaseAuth()
    return isAuthenticated.value && isCacheStale.value
  })

  // Actions
  const setError = (message: string | null) => {
    error.value = message
    if (message) {
      setTimeout(() => {
        error.value = null
      }, 5000)
    }
  }

  const setSaveMessage = (message: string | null) => {
    saveMessage.value = message
    if (message) {
      setTimeout(() => {
        saveMessage.value = null
      }, 3000)
    }
  }

  const loadUserNotificationData = async (force = false) => {
    const { isAuthenticated } = useFirebaseAuth()
    
    if (!isAuthenticated.value) {
      lastFetched.value = Date.now()
      return
    }

    // Skip if cache is still fresh and not forcing refresh
    if (!force && !isCacheStale.value && lastFetched.value !== null) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const { getUserNotifications, getCurrentDeviceToken } = useNotificationsDb()
      
      const userData = await getUserNotifications()
      if (userData) {
        // Get the current device's token from the tokens object
        const currentDeviceToken = await getCurrentDeviceToken()
        serverToken.value = currentDeviceToken?.fcmToken || null
        
        // Load notification preferences if they exist
        if (userData.preferences) {
          Object.assign(preferences.value, userData.preferences)
        }
      }
      
      lastFetched.value = Date.now()
    } catch (err) {
      console.error('Failed to load user notification data:', err)
      setError('Failed to load notification data')
    } finally {
      isLoading.value = false
    }
  }

  const syncToken = async () => {
    if (!token.value) return

    const { isAuthenticated } = useFirebaseAuth()
    if (!isAuthenticated.value) return

    isLoading.value = true
    error.value = null
    
    try {
      const { saveUserToken } = useNotificationsDb()
      await saveUserToken(token.value)
      serverToken.value = token.value
      setSaveMessage('Device synchronized successfully!')
      
      // Update cache timestamp
      lastFetched.value = Date.now()
    } catch (err) {
      console.error('Failed to sync token:', err)
      setError('Failed to sync device. Please try again.')
    } finally {
      isLoading.value = false
    }
  }

  const disableNotifications = async () => {
    const { isAuthenticated } = useFirebaseAuth()
    if (!isAuthenticated.value) return

    isLoading.value = true
    error.value = null

    try {
      const { disableUserNotifications } = useNotificationsDb()
      await disableUserNotifications()
      
      // Reset local state
      token.value = null
      serverToken.value = null
      lastFetched.value = Date.now()
      
      setSaveMessage('Notifications disabled successfully!')
    } catch (err) {
      console.error('Failed to disable notifications:', err)
      setError('Failed to disable notifications. Please try again.')
    } finally {
      isLoading.value = false
    }
  }

  const saveNotificationPreferences = async () => {
    if (!canModifyNotifications.value) return

    isLoading.value = true
    error.value = null

    try {
      const { saveUserNotificationPreferences } = useNotificationsDb()
      await saveUserNotificationPreferences(preferences.value)
      setSaveMessage('Notification preferences saved successfully!')
      
      // Update cache timestamp
      lastFetched.value = Date.now()
    } catch (err) {
      console.error('Failed to save preferences:', err)
      setError('Failed to save preferences. Please try again.')
    } finally {
      isLoading.value = false
    }
  }

  const enableNotifications = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const { askPermission, getPermissionStatus } = useFirebasePush()
      
      token.value = await askPermission()
      permissionStatus.value = getPermissionStatus()

      const { isAuthenticated } = useFirebaseAuth()
      if (token.value && isAuthenticated.value) {
        // Automatically sync token when we get it
        await syncToken()
      } else if (token.value) {
        // Load existing server token to compare
        await loadUserNotificationData()
      }
    } catch (err) {
      console.error('Failed to enable notifications:', err)
      setError('Failed to enable notifications. Please try again.')
    } finally {
      isLoading.value = false
    }
  }

  const initializeNotifications = async () => {
    const { getPermissionStatus, getExistingToken, startListening } = useFirebasePush()
    const { isAuthenticated } = useFirebaseAuth()
    
    // Check permission status
    permissionStatus.value = getPermissionStatus()

    // If permission is granted, try to get existing token
    if (permissionStatus.value === 'granted') {
      isLoading.value = true
      try {
        token.value = await getExistingToken()
        if (isAuthenticated.value) {
          await loadUserNotificationData()
        } else {
          lastFetched.value = Date.now()
        }
      } catch (err) {
        console.error('Failed to get existing token:', err)
        lastFetched.value = Date.now()
      } finally {
        isLoading.value = false
      }
    } else {
      if (isAuthenticated.value) {
        // Load user notification data even without token to get preferences
        await loadUserNotificationData()
      } else {
        lastFetched.value = Date.now()
      }
    }

    // Start push notification listener
    startListening()
  }

  // Method to refresh data if cache is stale
  const refreshIfStale = async () => {
    if (needsRefresh.value) {
      await loadUserNotificationData(true)
    }
  }

  // Clear cache (useful for logout)
  const clearCache = () => {
    serverToken.value = null
    lastFetched.value = null
    preferences.value = {
      serviceReminders: true,
    }
  }

  return {
    // State
    preferences,
    token,
    serverToken,
    permissionStatus,
    lastFetched,
    isLoading,
    error,
    saveMessage,
    // Getters
    isTokenSynced,
    shouldShowOutOfSync,
    canModifyNotifications,
    isCacheStale,
    needsRefresh,
    // Actions
    setError,
    setSaveMessage,
    loadUserNotificationData,
    syncToken,
    disableNotifications,
    saveNotificationPreferences,
    enableNotifications,
    initializeNotifications,
    refreshIfStale,
    clearCache
  }
})