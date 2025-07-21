<template>
  <div class="layout">
    <Header v-if="!showBottomNav"/>
    <main :class="{ 'pb-safe-nav': showBottomNav }">
      <slot />
    </main>
    <Footer v-if="!showBottomNav" />
    <BottomNav v-if="showBottomNav" />
  </div>
</template>

<script setup lang="ts">
import { Header, Footer, BottomNav } from '#components'
import { computed, onMounted } from 'vue'

const { $pwa } = useNuxtApp()

const isMobile = computed(() => {
  if (process.client) {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768
  }
  return false
})

const showBottomNav = computed(() => {
  const isPWA = process.client && $pwa?.isPWAInstalled
  console.log('showBottomNav:', { isPWA, isMobile: isMobile.value }) // Debugging
  return isPWA && isMobile.value
})

definePageMeta({
  layout: 'default'
})

onMounted(() => {
  console.log('PWA Status:', $pwa?.isPWAInstalled) // Debugging
  console.log('Is Mobile:', isMobile.value) // Debugging
})
</script>

<style scoped>
/* Increased padding-bottom to ensure content is not covered */
.pb-safe-nav {
  /* Bottom nav height (5rem) + gradient overlay (~1rem) + extra gap (1.5rem) + safe area */
  padding-bottom: calc(7.5rem + env(safe-area-inset-bottom));
}

/* Debugging style */
.debug {
  position: fixed;
  bottom: calc(8rem + env(safe-area-inset-bottom));
  left: 1rem;
  background: rgba(255, 0, 0, 0.5);
  color: white;
  padding: 0.5rem;
  z-index: 1000;
}
</style>