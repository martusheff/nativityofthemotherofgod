<template>
  <div class="space-y-6">
    <!-- Push Notifications -->
    <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Push Notifications</h3>
          <p class="text-sm text-gray-600 mt-1">Stay updated with instant notifications on your device</p>
        </div>
      </div>

      <!-- Push notification status and controls -->
      <div class="space-y-4">
        <!-- Current Status -->
        <div class="p-4 rounded-xl border border-stone-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center mr-4" :class="getStatusBgClass()">
                <Icon :name="getStatusIcon()" :class="getStatusIconClass()" class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-medium text-gray-900">
                  {{ getStatusTitle() }}
                </h4>
                <p class="text-sm text-gray-600">
                  {{ getStatusDescription() }}
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button v-if="permissionStatus === 'granted' && !token" @click="enableNotifications" :disabled="loading"
                class="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm">
                {{ loading ? 'Loading...' : 'Get Token' }}
              </button>

              <button v-if="permissionStatus === 'default' || permissionStatus === 'denied'"
                @click="enableNotifications" :disabled="loading"
                class="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm">
                {{ loading ? 'Loading...' : 'Enable' }}
              </button>

              <button v-if="permissionStatus === 'denied'" @click="showResetInstructions"
                class="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-all font-medium text-sm">
                Reset
              </button>

              <button v-if="token && !isTokenSynced" @click="syncToken" :disabled="syncing"
                class="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm">
                {{ syncing ? 'Syncing...' : 'Sync' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Permission Guide -->
        <div v-if="isMobile && (permissionStatus === 'denied' || permissionStatus === 'default')"
          class="p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div class="flex items-start">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <Icon name="heroicons:device-phone-mobile" class="w-4 h-4 text-blue-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-blue-900">Mobile Device Detected</p>
              <p class="text-xs text-blue-700 mt-1">{{ getMobileGuideText() }}</p>
              <div v-if="permissionStatus === 'denied'" class="mt-2 p-2 bg-blue-100 rounded-lg">
                <p class="text-xs text-blue-800 font-medium">{{ getMobileResetInstructions() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Token Sync Status -->
        <div v-if="token && !isTokenSynced" class="p-4 rounded-xl bg-red-100 border border-red-200">
          <div class="flex items-start">
            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 text-red-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-red-900">Notifications Need to Sync</p>
              <p class="text-xs text-red-700 mt-1">
                Your device token has changed and needs to be synchronized with our servers to continue receiving
                notifications.
              </p>
              <p class="text-xs text-red-700 mt-2">
                Until synced, you won't receive any push notifications even if they're enabled below.
              </p>
            </div>
          </div>
        </div>

        <!-- Reset Instructions Modal -->
        <div v-if="showInstructions" class="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div class="flex items-start">
            <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-amber-900">Reset Notification Permissions</p>
              <p class="text-xs text-amber-700 mt-1">{{ resetInstructions }}</p>
              <div class="mt-2 p-2 bg-amber-100 rounded-lg">
                <p class="text-xs text-amber-800 font-medium">
                  If you're having trouble resetting your permissions, reinstall the app and try again.
                </p>
              </div>
              <p class="text-xs text-amber-600 mt-2">After resetting, refresh this page and try enabling notifications
                again.</p>
              <button @click="showInstructions = false"
                class="mt-3 text-xs bg-amber-600 text-white px-3 py-1 rounded-lg hover:bg-amber-700 transition-colors">
                Got it
              </button>
            </div>
          </div>
        </div>

        <!-- Individual Notification Items -->
        <div class="space-y-3">
          <div class="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-white">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <Icon name="heroicons:wrench-screwdriver" class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h5 class="font-medium text-gray-900">Service Reminders</h5>
                <p class="text-sm text-gray-600">Reminders for upcoming service appointments and maintenance</p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="notifications.serviceReminders" @change="saveNotificationSettings" type="checkbox"
                class="sr-only peer" :disabled="!canModifyNotifications">
              <div
                class="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors"
                :class="canModifyNotifications
                  ? 'bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 peer-checked:bg-amber-600'
                  : 'bg-gray-100 peer-checked:bg-gray-300'">
              </div>
            </label>
          </div>

        </div>

        <!-- Save message display -->
        <div v-if="saveMessage" class="p-3 bg-green-50 border border-green-200 rounded-xl">
          <p class="text-green-700 text-sm">{{ saveMessage }}</p>
        </div>

        <!-- Token Display (for development) -->
        <div v-if="token && isDevelopment" class="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <h5 class="text-sm font-medium text-stone-700 mb-2">FCM Token Status (Debug)</h5>
          <div class="space-y-2">
            <div class="bg-white p-3 rounded-lg border border-stone-200">
              <p class="text-xs text-stone-500 mb-1">Current Token:</p>
              <code class="text-xs text-stone-600 break-all">{{ token }}</code>
            </div>
            <div class="bg-white p-3 rounded-lg border border-stone-200">
              <p class="text-xs text-stone-500 mb-1">Server Token:</p>
              <code class="text-xs text-stone-600 break-all">{{ serverToken || 'Not registered' }}</code>
            </div>
            <div class="flex items-center text-xs">
              <div class="w-2 h-2 rounded-full mr-2" :class="isTokenSynced ? 'bg-green-500' : 'bg-red-500'"></div>
              <span :class="isTokenSynced ? 'text-green-600' : 'text-red-600'">
                {{ isTokenSynced ? 'Synced' : 'Out of sync' }}
              </span>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useFirebasePush } from '#imports'

// Push notification composable
const { askPermission, startListening, getExistingToken, getPermissionStatus, resetPermissions } = useFirebasePush()

// Notification preferences (simplified to 1 type now)
const notifications = reactive({
  serviceReminders: true,
  // articleUpdates: false // Commented out
})

const saving = ref(false)
const saveMessage = ref('')
const loading = ref(false)
const syncing = ref(false)

// Push notification state
const token = ref<string | null>(null)
const serverToken = ref<string | null>(null)
const permissionStatus = ref<'default' | 'granted' | 'denied' | 'unsupported'>('default')
const showInstructions = ref(false)
const resetInstructions = ref('')

// Mobile detection
const isMobile = ref(false)
const isDevelopment = ref(process.env.NODE_ENV === 'development')

// All notifications toggle state (commented out)
// const allNotificationsToggle = ref(false)

// Computed properties
const isTokenSynced = computed(() => {
  return token.value && serverToken.value && token.value === serverToken.value
})

const canModifyNotifications = computed(() => {
  return permissionStatus.value === 'granted' && isTokenSynced.value
})

const allNotificationsEnabled = computed(() => {
  return Object.values(notifications).every(val => val)
})

// Detect mobile device
const detectMobile = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isSmallScreen = window.innerWidth <= 768

  return isMobileUA || (isTouchDevice && isSmallScreen)
}

// Mobile-specific guidance
const getMobileGuideText = () => {
  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    return 'On iOS, tap "Enable" and then "Allow" when Safari shows the notification prompt. You may need to check Settings > Safari > Notifications if blocked.'
  } else if (userAgent.includes('android')) {
    return 'On Android, tap "Enable" and select "Allow" when Chrome shows the notification prompt. Check browser settings if notifications seem blocked.'
  } else {
    return 'Tap "Enable" and allow notifications when your browser prompts you. Check your browser settings if notifications are blocked.'
  }
}

const getMobileResetInstructions = () => {
  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    return 'iOS: Go to Settings > Safari > Notifications, find this site and change to "Allow"'
  } else if (userAgent.includes('android')) {
    return 'Android: Go to Chrome Settings > Site Settings > Notifications, find this site and enable'
  } else {
    return 'Check your browser settings to reset notification permissions for this site'
  }
}

// Computed properties for UI status
const getStatusBgClass = () => {
  if (permissionStatus.value === 'granted' && token.value && isTokenSynced.value) {
    return 'bg-green-100'
  } else if (permissionStatus.value === 'granted' && token.value) {
    return 'bg-amber-100'
  } else if (permissionStatus.value === 'denied') {
    return 'bg-red-100'
  } else if (permissionStatus.value === 'unsupported') {
    return 'bg-gray-100'
  }
  return 'bg-stone-100'
}

const getStatusIconClass = () => {
  if (permissionStatus.value === 'granted' && token.value && isTokenSynced.value) {
    return 'text-green-600'
  } else if (permissionStatus.value === 'granted' && token.value) {
    return 'text-amber-600'
  } else if (permissionStatus.value === 'denied') {
    return 'text-red-600'
  } else if (permissionStatus.value === 'unsupported') {
    return 'text-gray-500'
  }
  return 'text-stone-500'
}

const getStatusIcon = () => {
  if (permissionStatus.value === 'granted' && token.value && isTokenSynced.value) {
    return 'heroicons:bell'
  } else if (permissionStatus.value === 'granted' && token.value) {
    return 'heroicons:bell-alert'
  } else if (permissionStatus.value === 'denied') {
    return 'heroicons:bell-slash'
  } else if (permissionStatus.value === 'unsupported') {
    return 'heroicons:x-circle'
  }
  return 'heroicons:bell-slash'
}

const getStatusTitle = () => {
  if (permissionStatus.value === 'granted' && token.value && isTokenSynced.value) {
    return 'Push Notifications Ready'
  } else if (permissionStatus.value === 'granted' && token.value) {
    return 'Notifications Need to Sync'
  } else if (permissionStatus.value === 'granted') {
    return 'Permission Granted'
  } else if (permissionStatus.value === 'denied') {
    return 'Push Notifications Blocked'
  } else if (permissionStatus.value === 'unsupported') {
    return 'Push Notifications Not Supported'
  }
  return 'Push Notifications Disabled'
}

const getStatusDescription = () => {
  if (permissionStatus.value === 'granted' && token.value && isTokenSynced.value) {
    return 'All set! You\'ll receive notifications based on your preferences below'
  } else if (permissionStatus.value === 'granted' && token.value) {
    return 'Token needs to be synced with our servers to receive notifications'
  } else if (permissionStatus.value === 'granted') {
    return 'Permission granted, click "Get Token" to complete setup'
  } else if (permissionStatus.value === 'denied') {
    return 'Notifications are blocked. Click "Reset" for instructions to re-enable'
  } else if (permissionStatus.value === 'unsupported') {
    return 'Your browser doesn\'t support push notifications'
  }
  return 'Enable to get instant notifications on this device'
}

// Simulate checking server token
const checkServerToken = async () => {
  // Simulate API call to check if token exists on server
  await new Promise(resolve => setTimeout(resolve, 500))

  // For demo purposes, randomly decide if token is synced
  const isSync = Math.random() > 0.3 // 70% chance it's synced

  if (isSync && token.value) {
    serverToken.value = token.value
  } else {
    serverToken.value = token.value ? 'old_token_example_123' : null
  }
}

// Sync token with server
const syncToken = async () => {
  if (!token.value) return

  syncing.value = true
  try {
    // Simulate API call to register token
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In real app: await registerTokenWithServer(token.value)
    console.log('Syncing token with server:', token.value)

    serverToken.value = token.value
    saveMessage.value = 'Device synchronized successfully!'
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Failed to sync token:', error)
  } finally {
    syncing.value = false
  }
}

// Check existing permissions and token on mount
onMounted(async () => {
  // Detect mobile
  isMobile.value = detectMobile()

  // Check permission status
  permissionStatus.value = getPermissionStatus()
  console.log('Permission status:', permissionStatus.value)

  // If permission is granted, try to get existing token
  if (permissionStatus.value === 'granted') {
    loading.value = true
    try {
      token.value = await getExistingToken()
      if (token.value) {
        await checkServerToken()
      }
    } catch (error) {
      console.error('Error getting existing token:', error)
    } finally {
      loading.value = false
    }
  }

  // Start push notification listener
  startListening()
})

const saveNotificationSettings = async () => {
  if (!canModifyNotifications.value) return

  saving.value = true
  saveMessage.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In real app, save to backend with the synced token
    console.log('Saving notification preferences:', notifications)
    console.log('With token:', token.value)

    saveMessage.value = 'Notification preferences saved successfully!'
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Failed to save preferences:', error)
    saveMessage.value = 'Failed to save preferences. Please try again.'
  } finally {
    saving.value = false
  }
}

const enableNotifications = async () => {
  loading.value = true
  try {
    token.value = await askPermission()
    permissionStatus.value = getPermissionStatus()
    console.log('Notification permission result:', permissionStatus.value, 'Token:', token.value)

    if (token.value) {
      await checkServerToken()
    }
  } catch (err) {
    console.error('Notification permission error:', err)
  } finally {
    loading.value = false
  }
}

const showResetInstructions = () => {
  resetInstructions.value = resetPermissions()
  showInstructions.value = true
}
</script>