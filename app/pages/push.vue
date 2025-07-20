<script setup lang="ts">
import { ref } from 'vue'
import { usePush } from '~/composables/usePush'

const { askPermission, startListening } = usePush()

// Start listening for messages immediately on client side
startListening()

// ✅ Make token reactive
const token = ref<string | undefined>(undefined)

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

<template>
  <p v-if="token">Token: {{ token }}</p>
  <button @click="enableNotifications">Enable Notifications</button>
</template>
