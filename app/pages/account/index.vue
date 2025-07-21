<template>
  <client-only>
    <div class="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/20 pb-24">
      <!-- Header with Sign Out -->
      <div class="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-10">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div>
                <div class="flex items-center space-x-4">
                  <h1 class="text-2xl font-bold text-gray-900">Account</h1>
                  <!-- Beta badge with tooltip -->
                  <div class="relative inline-block" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
                    <div class="flex items-center space-x-1 border border-amber-500 text-amber-500 px-3 py-0.5 rounded-full text-sm  font-medium cursor-help">
                      <span>BETA</span>
                      <Icon name="heroicons:information-circle" class="w-5 h-5 text-lg" />
                    </div>
                    
                    <!-- Tooltip -->
                    <div v-show="showTooltip" class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-20">
                      <div class=" from-amber-500 to-amber-600 bg-gradient-to-br text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                        Account features are still in BETA. Some functionality may not work as expected.
                        <!-- Arrow -->
                        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              @click="handleSignOut"
              class="p-2 rounded-full hover:bg-stone-100 transition-colors group text-2xl flex items-center justify-center"
              title="Sign Out"
            >
              <Icon name="heroicons:arrow-right-start-on-rectangle" class="w-8 h-8 text-stone-600 group-hover:text-stone-800" />
            </button>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-6">
        <!-- Profile Summary Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <img
                v-if="user?.photoURL"
                :src="user.photoURL"
                :alt="user.displayName || 'User'"
                class="w-16 h-16 rounded-2xl object-cover"
              />
              <Icon v-else name="heroicons:user" class="w-8 h-8 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-xl font-semibold text-gray-900 truncate">
                {{ user?.displayName || 'Welcome!' }}
              </h2>
              <p class="text-sm text-gray-600 truncate">{{ user?.email }}</p>
              <div class="flex items-center mt-2">
                <div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span class="text-xs text-green-700 font-medium">Verified Account</span>
              </div>
            </div>

          </div>


        </div>

        <!-- Navigation Tabs -->
        <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-2 mb-6">
          <nav class="flex space-x-1">

            <button
              @click="activeTab = 'notifications'"
              :class="[
                'flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl transition-all',
                activeTab === 'notifications' 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm' 
                  : 'text-stone-600 hover:bg-stone-50'
              ]"
            >
              <Icon name="heroicons:bell" class="w-4 h-4 mr-2" />
              Notifications
            </button>
            <button
              @click="activeTab = 'donations'"
              :class="[
                'flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl transition-all',
                activeTab === 'donations' 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm' 
                  : 'text-stone-600 hover:bg-stone-50'
              ]"
            >
              <Icon name="heroicons:heart" class="w-4 h-4 mr-2" />
              Support
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="space-y-6">
          <!-- Overview Tab -->
          <AccountOverviewTab v-if="activeTab === 'overview'" :user="user" />
          
          <!-- Notifications Tab -->
          <AccountNotificationsTab v-if="activeTab === 'notifications'" />
          
          <!-- Donations Tab -->
          <AccountDonationsTab v-if="activeTab === 'donations'" />
        </div>
      </div>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'
import { navigateTo } from '#app'

// Components


// Meta
definePageMeta({
  title: 'Account - Your Profile',
  middleware: ['auth'],
  ssr: false
})

// Auth state
const { user, loading: authLoading, error: authError, isAuthenticated, isEmailVerified, signOut, updateProfile } = useFirebaseAuth()

// Tab state
const activeTab = ref('notifications')

// Tooltip state
const showTooltip = ref(false)

// Profile form
const profileForm = reactive({
  displayName: ''
})

// Initialize profile form when user data is available
watch(user, (newUser) => {
  if (newUser) {
    profileForm.displayName = newUser.displayName || ''
  }
}, { immediate: true })


const handleSignOut = async () => {
  try {
    await signOut()
    await navigateTo('/login')
  } catch (error: any) {
    console.error('Sign out error:', error)
  }
}

// Utility functions
const formatDate = (dateString?: string) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>