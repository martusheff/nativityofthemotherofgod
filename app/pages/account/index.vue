<template>
  <client-only>
    <div class="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/20 pb-24">
      <!-- Header with Sign Out -->
      <div class="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-10">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div>
                <div class="flex items-center space-x-2">
                  <h1 class="text-2xl font-bold text-gray-900">Account</h1>
                  <!-- Beta badge with tooltip -->
                  <div class="relative inline-block" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
                    <div class="flex items-center space-x-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium cursor-help">
                      <span>BETA</span>
                      <Icon name="heroicons:information-circle" class="w-3 h-3" />
                    </div>
                    
                    <!-- Tooltip -->
                    <div v-show="showTooltip" class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-20">
                      <div class="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                        Account features are still in beta and subject to change
                        <!-- Arrow -->
                        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <p class="text-sm text-gray-600">{{ user?.email }}</p>
              </div>
            </div>
            <button
              @click="handleSignOut"
              class="p-2 rounded-full hover:bg-stone-100 transition-colors group"
              title="Sign Out"
            >
              <Icon name="heroicons:arrow-right-start-on-rectangle" class="w-5 h-5 text-stone-600 group-hover:text-stone-800" />
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
            <button
              @click="editMode = !editMode"
              class="p-2 rounded-xl hover:bg-stone-100 transition-colors"
            >
              <Icon name="heroicons:pencil" class="w-4 h-4 text-stone-600" />
            </button>
          </div>

          <!-- Quick Edit Form -->
          <div v-if="editMode" class="mt-6 pt-6 border-t border-stone-200">
            <form @submit.prevent="updateProfileHandler" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                <input
                  v-model="profileForm.displayName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  placeholder="Enter your display name"
                />
              </div>

              <div v-if="profileError" class="bg-red-50 border border-red-200 rounded-xl p-3">
                <p class="text-red-700 text-sm">{{ profileError }}</p>
              </div>

              <div v-if="profileSuccess" class="bg-green-50 border border-green-200 rounded-xl p-3">
                <p class="text-green-700 text-sm">{{ profileSuccess }}</p>
              </div>

              <div class="flex space-x-3">
                <button
                  type="submit"
                  :disabled="profileSubmitting"
                  class="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  {{ profileSubmitting ? 'Updating...' : 'Save Changes' }}
                </button>
                <button
                  type="button"
                  @click="editMode = false"
                  class="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-2 mb-6">
          <nav class="flex space-x-1">
            <button
              @click="activeTab = 'overview'"
              :class="[
                'flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl transition-all',
                activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm' 
                  : 'text-stone-600 hover:bg-stone-50'
              ]"
            >
              <Icon name="heroicons:home" class="w-4 h-4 mr-2" />
              Overview
            </button>
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
const activeTab = ref('overview')

// Tooltip state
const showTooltip = ref(false)

// Profile form
const editMode = ref(false)
const profileForm = reactive({
  displayName: ''
})
const profileError = ref('')
const profileSuccess = ref('')
const profileSubmitting = ref(false)

// Initialize profile form when user data is available
watch(user, (newUser) => {
  if (newUser) {
    profileForm.displayName = newUser.displayName || ''
  }
}, { immediate: true })

// Profile functions
const updateProfileHandler = async () => {
  if (!user.value) return

  profileError.value = ''
  profileSuccess.value = ''
  profileSubmitting.value = true

  try {
    await updateProfile({ displayName: profileForm.displayName })
    profileSuccess.value = 'Profile updated successfully'
    editMode.value = false
    setTimeout(() => {
      profileSuccess.value = ''
    }, 3000)
  } catch (error: any) {
    profileError.value = error.message || 'Failed to update profile'
  } finally {
    profileSubmitting.value = false
  }
}

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