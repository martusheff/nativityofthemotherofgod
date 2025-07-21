<template>
  <div class="space-y-6">
    <!-- Email Notifications -->
    <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Email Notifications</h3>
          <p class="text-sm text-gray-600 mt-1">Choose what updates you'd like to receive via email</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 rounded-xl border border-stone-200">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
              <Icon name="heroicons:newspaper" class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Article Updates</h4>
              <p class="text-sm text-gray-600">Get notified when new articles are published</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notifications.articles" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between p-4 rounded-xl border border-stone-200">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
              <Icon name="heroicons:calendar-days" class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Schedule Updates</h4>
              <p class="text-sm text-gray-600">Updates about events and schedule changes</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notifications.schedule" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between p-4 rounded-xl border border-stone-200">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
              <Icon name="heroicons:megaphone" class="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Important Announcements</h4>
              <p class="text-sm text-gray-600">Critical updates and announcements</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notifications.announcements" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between p-4 rounded-xl border border-stone-200">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
              <Icon name="heroicons:gift" class="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Weekly Newsletter</h4>
              <p class="text-sm text-gray-600">Weekly summary of content and updates</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notifications.newsletter" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>
      </div>

      <div class="mt-6 pt-6 border-t border-stone-200">
        <button
          @click="saveNotificationSettings"
          :disabled="saving"
          class="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          {{ saving ? 'Saving...' : 'Save Preferences' }}
        </button>
        
        <div v-if="saveMessage" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
          <p class="text-green-700 text-sm">{{ saveMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Push Notifications -->
    <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Push Notifications</h3>
          <p class="text-sm text-gray-600 mt-1">Instant notifications on your device</p>
        </div>
      </div>
      
      <!-- Push notification status and controls -->
      <div class="space-y-4">
        <!-- Current Status -->
        <div class="p-4 rounded-xl border border-stone-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center mr-4"
                   :class="token ? 'bg-green-100' : 'bg-stone-100'">
                <Icon :name="token ? 'heroicons:bell' : 'heroicons:bell-slash'" 
                      :class="token ? 'text-green-600' : 'text-stone-500'"
                      class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-medium text-gray-900">
                  {{ token ? 'Push Notifications Enabled' : 'Push Notifications Disabled' }}
                </h4>
                <p class="text-sm text-gray-600">
                  {{ token ? 'You\'ll receive instant notifications' : 'Enable to get instant notifications on this device' }}
                </p>
              </div>
            </div>
            <button
              @click="enableNotifications"
              :disabled="!!token"
              class="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
            >
              {{ token ? 'Enabled' : 'Enable' }}
            </button>
          </div>
        </div>

        <!-- Token Display (for development) -->
        <div v-if="token" class="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <h5 class="text-sm font-medium text-stone-700 mb-2">Device Token (Debug)</h5>
          <div class="bg-white p-3 rounded-lg border border-stone-200">
            <code class="text-xs text-stone-600 break-all">{{ token }}</code>
          </div>
          <p class="text-xs text-stone-500 mt-2">This token identifies your device for push notifications</p>
        </div>

        <!-- Browser compatibility info -->
        <div class="p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div class="flex items-start">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <Icon name="heroicons:information-circle" class="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-blue-900">Browser Support</p>
              <p class="text-xs text-blue-700 mt-1">
                Push notifications work best in modern browsers. Make sure to allow notifications when prompted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification History -->
    <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
      <div class="space-y-3">
        <div class="flex items-start p-3 rounded-xl border border-stone-100">
          <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
            <Icon name="heroicons:newspaper" class="w-4 h-4 text-blue-600" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">New article published</p>
            <p class="text-xs text-gray-600 mt-1">"Understanding Modern Web Development" is now available</p>
            <p class="text-xs text-gray-500 mt-1">2 hours ago</p>
          </div>
        </div>
        
        <div class="flex items-start p-3 rounded-xl border border-stone-100">
          <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
            <Icon name="heroicons:calendar-days" class="w-4 h-4 text-green-600" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">Schedule update</p>
            <p class="text-xs text-gray-600 mt-1">Weekly meeting moved to 3 PM tomorrow</p>
            <p class="text-xs text-gray-500 mt-1">1 day ago</p>
          </div>
        </div>

        <div class="flex items-start p-3 rounded-xl border border-stone-100">
          <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
            <Icon name="heroicons:gift" class="w-4 h-4 text-amber-600" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">Weekly Newsletter</p>
            <p class="text-xs text-gray-600 mt-1">Your weekly digest of updates and news</p>
            <p class="text-xs text-gray-500 mt-1">3 days ago</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useFirebasePush } from '#imports'

// Push notification composable
const { askPermission, startListening } = useFirebasePush()

// Notification preferences
const notifications = reactive({
  articles: true,
  schedule: false,
  announcements: true,
  newsletter: true
})

const saving = ref(false)
const saveMessage = ref('')

// Push notification token
const token = ref<string | null>(null)

// Start listening for messages immediately on client side
onMounted(() => {
  // Load saved preferences (stub)
  console.log('Loading notification preferences...')
  
  // Start push notification listener
  startListening()
})

const saveNotificationSettings = async () => {
  saving.value = true
  saveMessage.value = ''
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In real app, save to backend
    console.log('Saving notification preferences:', notifications)
    
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
  try {
    token.value = await askPermission()
    console.log('Notification permission granted, token:', token.value)
    // Send token to your server here if needed
  } catch (err) {
    console.error('Notification permission error:', err)
  }
}
</script>