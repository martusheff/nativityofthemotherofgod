<template>
  <client-only>
    <div class="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/20 pb-24">
      <!-- Header with Sign Out -->
      <div class="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-10">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-4">
                <h1 class="text-2xl font-bold text-gray-900">Account</h1>
              </div>
            </div>
            <button @click="handleSignOut"
              class="p-2 rounded-full hover:bg-stone-100 transition-colors group text-2xl flex items-center justify-center"
              title="Sign Out">
              <Icon name="heroicons:arrow-right-start-on-rectangle"
                class="w-8 h-8 text-stone-600 group-hover:text-stone-800" />
            </button>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-6">
        <!-- Profile Summary Card -->
        <div class="bg-white rounded-3xl shadow-sm border border-stone-200 p-4 mb-6">
          <div class="flex items-center space-x-4">
            <div
              class="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center flex-shrink-0">
              <img v-if="user?.photoURL" :src="user.photoURL" :alt="user.displayName || 'User'"
                class="w-16 h-16 rounded-2xl object-cover" />
              <Icon v-else name="heroicons:user" class="w-8 h-8 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-xl font-semibold text-gray-900 truncate">
                {{ user?.displayName || 'Welcome!' }}
              </h3>
              <p class="text-sm text-gray-600 truncate">{{ user?.email }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-2 mb-6">
          <nav class="flex space-x-1">

            <button @click="activeTab = 'notifications'" :class="[
              'flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl ',
              activeTab === 'notifications'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-50'
            ]">
              <Icon name="heroicons:bell" class="w-4 h-4 mr-2" />
              Notifications
            </button>
            <button @click="activeTab = 'donations'" :class="[
              'flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl',
              activeTab === 'donations'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-50'
            ]">
              <Icon name="heroicons:heart" class="w-4 h-4 mr-2" />
              Support
            </button>
          </nav>
        </div>
        <div class="space-y-6">
          <AccountNotificationsTab v-if="activeTab === 'notifications'" />
          <AccountDonationsTab v-if="activeTab === 'donations'" />
        </div>
      </div>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
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
const { user, loading: authLoading, error: authError, isAuthenticated, signOut } = useFirebaseAuth()

// Tab state
const activeTab = ref('notifications')

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