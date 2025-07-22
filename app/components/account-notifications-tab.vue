<template>
  <div class="space-y-6">
    <!-- Push Notifications -->
    <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-4">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Push Notifications</h3>
          <p class="text-sm text-gray-600 mt-1">Stay updated with instant notifications on your device</p>
        </div>
      </div>
      
      <div class="space-y-4">
        <!-- Authentication Required Message -->
        <div v-if="!isAuthenticated" class="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
          <div class="flex items-start">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 text-yellow-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-yellow-900">Authentication Required</p>
              <p class="text-xs text-yellow-700 mt-1">
                You need to be signed in to save notification preferences and sync your device token.
              </p>
            </div>
          </div>
        </div>

        <!-- Out of Sync Warning -->
        <div v-if="notificationsStore.shouldShowOutOfSync" class="p-4 rounded-xl bg-red-100 border border-red-200">
          <div class="flex items-start">
            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 text-red-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-red-900">Notifications Out of Sync</p>
              <p class="text-xs text-red-700 mt-1">
                Your device needs to be synchronized to receive notifications.
              </p>
            </div>
          </div>
        </div>

        <!-- Save/Error Messages -->
        <div v-if="notificationsStore.saveMessage" class="p-3 bg-green-50 border border-green-200 rounded-xl">
          <p class="text-green-700 text-sm">{{ notificationsStore.saveMessage }}</p>
        </div>

        <div v-if="notificationsStore.error" class="p-3 bg-red-50 border border-red-200 rounded-xl">
          <p class="text-red-700 text-sm">{{ notificationsStore.error }}</p>
        </div>

        <!-- Service Reminders -->
        <div class="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-white gap-2">
          <div class="flex items-center">
            <div class="w-10 min-w-10 h-10 border bg-amber-50 border-amber-500 rounded-xl flex items-center justify-center mr-4">
              <Icon name="heroicons:bell-alert" class="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h5 class="font-medium text-gray-900">Service Reminders</h5>
              <p class="text-sm text-gray-600">Reminders for upcoming service appointments and maintenance</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              v-model="notificationsStore.preferences.serviceReminders" 
              @change="notificationsStore.saveNotificationPreferences" 
              type="checkbox"
              class="sr-only peer" 
              :disabled="!notificationsStore.canModifyNotifications"
            >
            <div
              class="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors"
              :class="notificationsStore.canModifyNotifications
                ? 'bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 peer-checked:bg-amber-600'
                : 'bg-gray-100 peer-checked:bg-gray-300'">
            </div>
          </label>
        </div>

        <!-- Multi-Purpose Notification Button -->
        <div class="flex flex-col gap-2">
          <!-- Enable/Sync/Disable Button -->
          <button 
            @click="handleNotificationAction" 
            :disabled="getButtonDisabled()"
            :class="getButtonClass()"
            class="px-4 py-3 rounded-xl transition-all font-medium text-sm w-full">
            {{ getButtonText() }}
          </button>

          <!-- Disabled State Info -->
          <p v-if="notificationsStore.permissionStatus === 'denied'" class="text-xs text-gray-600 text-center">
            Notifications are blocked. Please reset permissions in your browser settings to enable notifications.
          </p>
          
          <p v-if="notificationsStore.permissionStatus === 'unsupported'" class="text-xs text-gray-600 text-center">
            Your browser doesn't support push notifications.
          </p>
        </div>


      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed, watch } from 'vue'
import { useFirebaseAuth } from '#imports'
import { useNotificationsStore } from '~/stores/notifications'

// Composables
const { isAuthenticated } = useFirebaseAuth()
const notificationsStore = useNotificationsStore()

// Button logic
const getButtonText = () => {
  if (notificationsStore.isLoading) return 'Loading...'
  
  if (notificationsStore.permissionStatus === 'denied' || notificationsStore.permissionStatus === 'unsupported') {
    return 'Enable Notifications'
  }
  
  if (notificationsStore.permissionStatus === 'default' || (notificationsStore.permissionStatus === 'granted' && !notificationsStore.token)) {
    return 'Enable Notifications'
  }
  
  if (notificationsStore.token && !notificationsStore.isTokenSynced) {
    return 'Sync Notifications'
  }
  
  if (notificationsStore.token && notificationsStore.isTokenSynced) {
    return 'Disable Notifications'
  }
  
  return 'Enable Notifications'
}

const getButtonClass = () => {
  const baseClass = 'disabled:opacity-50 disabled:cursor-not-allowed'
  
  if (notificationsStore.token && notificationsStore.isTokenSynced) {
    return `${baseClass} bg-red-500 text-white hover:bg-red-600`
  }
  
  return `${baseClass} bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700`
}

const getButtonDisabled = () => {
  return notificationsStore.isLoading || 
         notificationsStore.permissionStatus === 'denied' || 
         notificationsStore.permissionStatus === 'unsupported'
}

const handleNotificationAction = async () => {
  // Enable notifications
  if (notificationsStore.permissionStatus === 'default' || (notificationsStore.permissionStatus === 'granted' && !notificationsStore.token)) {
    await notificationsStore.enableNotifications()
  }
  // Sync notifications
  else if (notificationsStore.token && !notificationsStore.isTokenSynced) {
    await notificationsStore.syncToken()
  }
  // Disable notifications
  else if (notificationsStore.token && notificationsStore.isTokenSynced) {
    await notificationsStore.disableNotifications()
  }
}

// Initialize on mount
onMounted(async () => {
  await notificationsStore.initializeNotifications()
})

// Watch for authentication changes
watch(isAuthenticated, async (newVal, oldVal) => {
  if (newVal && !oldVal) {
    // User just authenticated - refresh data if cache is stale
    await notificationsStore.refreshIfStale()
  } else if (!newVal && oldVal) {
    // User just logged out - clear cache
    notificationsStore.clearCache()
  }
}, { immediate: false })

// Refresh data when component becomes visible (optional)
onActivated(async () => {
  await notificationsStore.refreshIfStale()
})
</script>