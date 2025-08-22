<template>
  <div class="layout">
    <Header v-if="!showBottomNav" />
    <!-- <PwaTopNav v-if="showBottomNav" /> -->
    <main>
      <slot />
      <div v-if="showBottomNav" class="pb-24" />
    </main>
    <Footer v-if="!showBottomNav" />
    <PwaBottomNav v-if="showBottomNav" />
  </div>
</template>

<script setup lang="ts">
import { Header, Footer, PwaBottomNav } from '#components'
import { computed } from 'vue'

const { $pwa } = useNuxtApp()

const isMobile = computed(() => {
  if (import.meta.client) {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768
  }
  return false
})

const showBottomNav = computed(() => {
  const isPWA = import.meta.client && $pwa?.isPWAInstalled
  return isPWA && isMobile.value
})

definePageMeta({
  layout: 'default'
})
</script>