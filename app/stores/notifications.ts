// stores/notifications.ts - Fixed to prevent out-of-sync flash
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useBaseStore } from './baseStore'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'

interface NotificationPreferences {
  serviceReminders: boolean
}

export const useNotificationsStore = defineStore('notifications', () => {
  // Compose base store functionality
  const baseStore = useBaseStore({
    cacheDuration: 5 * 60 * 1000, // 5 minutes
    errorTimeout: 5000,
    messageTimeout: 3000
  })

  // Notification-specific state
  const preferences = ref<NotificationPreferences>({
    serviceReminders: true,
  })
  const token = ref<string | null>(null)
  const serverToken = ref<string | null>(null)
  const permissionStatus = ref<'default' | 'granted' | 'denied' | 'unsupported'>('default')
  
  // Track if we're in the middle of enabling/syncing to prevent false out-of-sync warnings
  const isSyncing = ref(false)

  // Computed properties
  const { isAuthenticated } = useFirebaseAuth()

  const isTokenSynced = computed(() => {
    return token.value && serverToken.value && token.value === serverToken.value
  })
  
  const shouldShowOutOfSync = computed(() => {
    // Don't show out of sync if we're currently syncing or if we haven't fetched data yet
    return baseStore.lastFetched.value !== null && 
           token.value && 
           !isTokenSynced.value && 
           !isSyncing.value &&
           !baseStore.isLoading.value // Don't show during loading states
  })
  
  const canModifyNotifications = computed(() => {
    return permissionStatus.value === 'granted' && isTokenSynced.value && isAuthenticated.value
  })
  
  const needsRefresh = computed(() => {
    return isAuthenticated.value && baseStore.isCacheStale.value
  })

  // Actions using base store
  const loadUserNotificationData = async (force = false) => {
    if (!isAuthenticated.value) {
      baseStore.updateLastFetched()
      return
    }

    if (!force && !baseStore.isCacheStale.value && baseStore.lastFetched.value !== null) {
      return
    }

    return baseStore.executeAsync(
      async () => {
        const { getUserNotifications, getCurrentDeviceToken } = useNotificationsDb()
        
        const userData = await getUserNotifications()
        if (userData) {
          const currentDeviceToken = await getCurrentDeviceToken()
          serverToken.value = currentDeviceToken?.fcmToken || null
          
          if (userData.preferences) {
            Object.assign(preferences.value, userData.preferences)
          }
        }
        
        return userData
      },
      {
        errorMessage: 'Failed to load notification data'
      }
    )
  }

  const syncToken = async () => {
    if (!token.value || !isAuthenticated.value) return

    isSyncing.value = true
    
    try {
      return await baseStore.executeAsync(
        async () => {
          const { saveUserToken } = useNotificationsDb()
          await saveUserToken(token.value!)
          serverToken.value = token.value
          return true
        },
        {
          successMessage: 'Device synchronized successfully!',
          errorMessage: 'Failed to sync device. Please try again.'
        }
      )
    } finally {
      isSyncing.value = false
    }
  }

  const disableNotifications = async () => {
    if (!isAuthenticated.value) return

    isSyncing.value = true
    
    try {
      return await baseStore.executeAsync(
        async () => {
          const { disableUserNotifications } = useNotificationsDb()
          await disableUserNotifications()
          
          token.value = null
          serverToken.value = null
          
          return true
        },
        {
          successMessage: 'Notifications disabled successfully!',
          errorMessage: 'Failed to disable notifications. Please try again.'
        }
      )
    } finally {
      isSyncing.value = false
    }
  }

  const saveNotificationPreferences = async () => {
    if (!canModifyNotifications.value) return

    return baseStore.executeAsync(
      async () => {
        const { saveUserNotificationPreferences } = useNotificationsDb()
        await saveUserNotificationPreferences(preferences.value)
        return preferences.value
      },
      {
        successMessage: 'Notification preferences saved successfully!',
        errorMessage: 'Failed to save preferences. Please try again.'
      }
    )
  }

  const enableNotifications = async () => {
    isSyncing.value = true
    
    try {
      return await baseStore.executeAsync(
        async () => {
          const { askPermission, getPermissionStatus } = useFirebasePush()
          
          token.value = await askPermission()
          permissionStatus.value = getPermissionStatus()

          if (token.value && isAuthenticated.value) {
            // Immediately sync the token to prevent out-of-sync flash
            const { saveUserToken } = useNotificationsDb()
            await saveUserToken(token.value)
            serverToken.value = token.value
            
            // Load any existing preferences
            await loadUserNotificationData()
          } else if (token.value) {
            await loadUserNotificationData()
          }
          
          return token.value
        },
        {
          errorMessage: 'Failed to enable notifications. Please try again.'
        }
      )
    } finally {
      isSyncing.value = false
    }
  }

  const initializeNotifications = async () => {
    const { getPermissionStatus, getExistingToken, startListening } = useFirebasePush()
    
    permissionStatus.value = getPermissionStatus()

    if (permissionStatus.value === 'granted') {
      await baseStore.executeAsync(
        async () => {
          token.value = await getExistingToken()
          if (isAuthenticated.value) {
            await loadUserNotificationData()
          }
          return token.value
        },
        {
          errorMessage: 'Failed to initialize notifications'
        }
      )
    } else {
      if (isAuthenticated.value) {
        await loadUserNotificationData()
      } else {
        baseStore.updateLastFetched()
      }
    }

    startListening()
  }

  const refreshIfStale = async () => {
    if (needsRefresh.value) {
      await loadUserNotificationData(true)
    }
  }

  const clearNotificationCache = () => {
    serverToken.value = null
    preferences.value = { serviceReminders: true }
    isSyncing.value = false
    baseStore.clearCache()
  }

  return {
    // Base store functionality
    ...baseStore,
    
    // Notification state
    preferences,
    token,
    serverToken,
    permissionStatus,
    isSyncing,
    
    // Computed
    isTokenSynced,
    shouldShowOutOfSync,
    canModifyNotifications,
    needsRefresh,
    
    // Actions
    loadUserNotificationData,
    syncToken,
    disableNotifications,
    saveNotificationPreferences,
    enableNotifications,
    initializeNotifications,
    refreshIfStale,
    clearNotificationCache
  }
})