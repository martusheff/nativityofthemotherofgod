<template>
  <client-only>
    <div class="min-h-screen bg-gradient-to-br from-stone-100 to-white mb-24">
      <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p class="text-gray-600">Access your account</p>
        </div>

        <!-- Loading State -->
        <div v-if="authLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>

        <!-- Redirect if already authenticated -->
        <div v-else-if="isAuthenticated" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Already signed in, redirecting...</p>
          </div>
        </div>

        <!-- Google Sign In -->
        <div v-else class="max-w-md mx-auto">
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

            <button
              @click="handleSignIn"
              :disabled="authSubmitting"
              class="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm font-medium"
            >
              <svg v-if="!authSubmitting" class="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <div v-if="authSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-3"></div>
              {{ authSubmitting ? 'Signing in...' : 'Continue with Google' }}
            </button>

            <!-- Error Message -->
            <div v-if="authError" class="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
              <p class="text-red-700 text-sm">{{ authError }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'
import { navigateTo } from '#app'

// Meta
definePageMeta({
  title: 'Sign In',
  ssr: false
})

// Auth state from composable
const { loading: authLoading, error: authError, signInWithGoogle, isAuthenticated } = useFirebaseAuth()
const authSubmitting = ref(false)

// Redirect to account if already authenticated
watch(isAuthenticated, (newValue) => {
  if (newValue) {
    console.log('User is authenticated, redirecting to /account')
    navigateTo('/account')
  }
}, { immediate: true })

const handleSignIn = async () => {
  if (authSubmitting.value) return
  
  console.log('Attempting Google sign-in')
  authSubmitting.value = true
  
  try {
    await signInWithGoogle()
    console.log('Sign-in successful, will redirect via watcher')
    // Navigation will happen via the watcher above
  } catch (error: any) {
    console.error('Sign-in error:', error.message)
    // Error is already set in the composable
  } finally {
    authSubmitting.value = false
  }
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