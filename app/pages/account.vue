<template>
  <client-only>
    <div class="min-h-screen bg-gradient-to-br from-stone-100 to-white">
      <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Account</h1>
          <p class="text-gray-600">Manage your profile and preferences</p>
        </div>

        <!-- Loading State -->
        <div v-if="authLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>

        <!-- Not Authenticated -->
        <div v-else-if="!user" class="max-w-md mx-auto">
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="text-center mb-6">
              <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p class="text-gray-600">Sign in to access your account</p>
            </div>

            <!-- Auth Tabs -->
            <div class="flex mb-6">
              <button
                @click="authMode = 'signin'"
                :class="authMode === 'signin' ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white' : 'bg-gray-100 text-gray-600'"
                class="flex-1 py-2 px-4 rounded-l-lg font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                @click="authMode = 'signup'"
                :class="authMode === 'signup' ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white' : 'bg-gray-100 text-gray-600'"
                class="flex-1 py-2 px-4 rounded-r-lg font-medium transition-colors"
              >
                Sign Up
              </button>
            </div>

            <!-- Auth Form -->
            <form @submit.prevent="handleAuth" class="space-y-4">
              <div v-if="authMode === 'signup'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  v-model="authForm.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  v-model="authForm.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  v-model="authForm.password"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <div v-if="authMode === 'signup'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  v-model="authForm.confirmPassword"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>

              <!-- Error Message -->
              <div v-if="authError" class="bg-red-50 border border-red-200 rounded-lg p-3">
                <p class="text-red-700 text-sm">{{ authError }}</p>
              </div>

              <button
                type="submit"
                :disabled="authSubmitting"
                class="w-full bg-gradient-to-br from-amber-500 to-amber-600 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="authSubmitting">
                  <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ authMode === 'signin' ? 'Signing In...' : 'Creating Account...' }}
                </span>
                <span v-else>
                  {{ authMode === 'signin' ? 'Sign In' : 'Create Account' }}
                </span>
              </button>
            </form>

            <!-- Google Sign In -->
            <div class="mt-6">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                @click="signInWithGoogle"
                :disabled="authSubmitting"
                class="mt-3 w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38 deflationary1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </div>

        <!-- Authenticated User -->
        <div v-else class="max-w-4xl mx-auto">
          <div class="grid md:grid-cols-3 gap-6">
            <!-- Profile Card -->
            <div class="md:col-span-1">
              <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="text-center">
                  <div class="mx-auto w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <img
                      v-if="user.photoURL"
                      :src="user.photoURL"
                      :alt="user.displayName"
                      class="w-24 h-24 rounded-full object-cover"
                    />
                    <svg v-else class="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900">{{ user.displayName || 'User' }}</h3>
                  <p class="text-gray-600">{{ user.email }}</p>
                  <div class="mt-4 flex flex-col space-y-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <div class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                      {{ user.emailVerified ? 'Verified' : 'Unverified' }}
                    </span>
                    <span class="text-xs text-gray-500">
                      Joined {{ formatDate(user.metadata?.creationTime) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Account Details -->
            <div class="md:col-span-2">
              <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-xl font-bold text-gray-900">Account Details</h3>
                  <button
                    @click="editMode = !editMode"
                    class="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    {{ editMode ? 'Cancel' : 'Edit Profile' }}
                  </button>
                </div>

                <!-- View Mode -->
                <div v-if="!editMode" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                    <p class="text-gray-900">{{ user.displayName || 'Not set' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <p class="text-gray-900">{{ user.email }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                    <p class="text-gray-900">{{ formatDate(user.metadata?.creationTime) }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Last Sign In</label>
                    <p class="text-gray-900">{{ formatDate(user.metadata?.lastSignInTime) }}</p>
                  </div>
                </div>

                <!-- Edit Mode -->
                <form v-else @submit.prevent="updateProfile" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                    <input
                      v-model="profileForm.displayName"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div v-if="profileError" class="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p class="text-red-700 text-sm">{{ profileError }}</p>
                  </div>

                  <div v-if="profileSuccess" class="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p class="text-green-700 text-sm">{{ profileSuccess }}</p>
                  </div>

                  <button
                    type="submit"
                    :disabled="profileSubmitting"
                    class="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span v-if="profileSubmitting">Updating...</span>
                    <span v-else>Update Profile</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Account Actions -->
          <div class="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Account Actions</h3>
            <div class="flex flex-wrap gap-4">
              <button
                v-if="!isEmailVerified"
                @click="sendVerificationEmail"
                :disabled="verificationSending"
                class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ verificationSending ? 'Sending...' : 'Verify Email' }}
              </button>

              <button
                @click="resetPassword"
                :disabled="resetSending"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ resetSending ? 'Sending...' : 'Reset Password' }}
              </button>

              <button
                @click="signOut"
                class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'

// Meta
definePageMeta({
  title: 'Account - Your Profile'
})

// Auth state from composable
const { user, loading: authLoading, error: authError, isAuthenticated, isEmailVerified, signIn, signUp, signInWithGoogle, signOut, updateProfile, sendVerificationEmail, resetPassword } = useFirebaseAuth()

// Auth form
const authMode = ref<'signin' | 'signup'>('signin')
const authForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const authSubmitting = ref(false)

// Profile form
const editMode = ref(false)
const profileForm = reactive({
  displayName: user.value?.displayName || ''
})
const profileError = ref('')
const profileSuccess = ref('')
const profileSubmitting = ref(false)

// Action states
const verificationSending = ref(false)
const resetSending = ref(false)

// Auth functions
const handleAuth = async () => {
  authError.value = ''
  authSubmitting.value = true

  try {
    if (authMode.value === 'signup') {
      if (authForm.password !== authForm.confirmPassword) {
        throw new Error('Passwords do not match')
      }
      await signUp(authForm.email, authForm.password, authForm.name)
    } else {
      await signIn(authForm.email, authForm.password)
    }
    // Reset form
    Object.assign(authForm, {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  } catch (error: any) {
    authError.value = error.message || 'An error occurred'
  } finally {
    authSubmitting.value = false
  }
}

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

* {
  transition: all 0.2s ease-in-out;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>