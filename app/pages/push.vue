<script setup lang="ts">
import { usePush } from '~/composables/usePush';

const { askPermission, startListening } = usePush();

// Start listening for messages immediately on client side
startListening();

const enableNotifications = async () => {
  try {
    const token = await askPermission();
    console.log('Notification permission granted, token:', token);
    // Send token to your server here if needed
  } catch (err) {
    console.error('Notification permission error:', err);
  }
};
</script>

<template>
  <button @click="enableNotifications">Enable Notifications</button>
</template>
