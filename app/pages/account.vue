<template>
  <div class="min-h-screen bg-gradient-to-br from-stone-100 to-white mb-24">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Account</h1>
        <p class="text-gray-600">Manage your profile and preferences</p>
      </div>

      <!-- Profile Section -->
      <div class="max-w-4xl mx-auto">
        <div class="grid md:grid-cols-3 gap-6">
          <!-- Profile Card -->
          <div class="md:col-span-1">
            <div class="bg-white rounded-xl shadow-lg p-6 text-center">
              <div class="mx-auto w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName"
                  class="w-24 h-24 rounded-full object-cover" />
                <svg v-else class="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900">{{ user.displayName || 'User' }}</h3>
              <p class="text-gray-600">{{ user.email }}</p>
            </div>
          </div>

          <!-- Account Details -->
          <div class="md:col-span-2">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-gray-900">Account Details</h3>
                <button @click="editMode = !editMode"
                  class="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700">
                  {{ editMode ? 'Cancel' : 'Edit Profile' }}
                </button>
              </div>

              <div v-if="!editMode" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <p class="text-gray-900">{{ user.displayName || 'Not set' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <p class="text-gray-900">{{ user.email }}</p>
                </div>
              </div>

              <form v-else @submit.prevent="updateProfileHandler" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input v-model="profileForm.displayName" type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter your display name" />
                </div>

                <div v-if="profileError" class="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p class="text-red-700 text-sm">{{ profileError }}</p>
                </div>

                <div v-if="profileSuccess" class="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p class="text-green-700 text-sm">{{ profileSuccess }}</p>
                </div>

                <button type="submit" :disabled="profileSubmitting"
                  class="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700">
                  <span v-if="profileSubmitting">Updating...</span>
                  <span v-else>Update Profile</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div class="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Account Actions</h3>
          <button @click="handleSignOut"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'

definePageMeta({
  middleware: ['auth'],
  title: 'Account - Your Profile'
})

const { user, signOut, updateProfile } = useFirebaseAuth()

const editMode = ref(false)
const profileForm = reactive({ displayName: '' })
const profileError = ref('')
const profileSuccess = ref('')
const profileSubmitting = ref(false)

watch(user, (newUser) => {
  if (newUser) profileForm.displayName = newUser.displayName || ''
}, { immediate: true })

const updateProfileHandler = async () => {
  if (!user.value) return

  profileError.value = ''
  profileSuccess.value = ''
  profileSubmitting.value = true

  try {
    await updateProfile({ displayName: profileForm.displayName })
    profileSuccess.value = 'Profile updated successfully'
    editMode.value = false
    setTimeout(() => { profileSuccess.value = '' }, 3000)
  } catch (err: any) {
    profileError.value = err.message || 'Failed to update profile'
  } finally {
    profileSubmitting.value = false
  }
}

const handleSignOut = async () => {
  try { await signOut() } catch (err) { console.error(err) }
}
</script>
