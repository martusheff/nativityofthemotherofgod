<template>
  <div class="layout">
    <Header v-if="!showBottomNav"/>
    <main :class="{ 'pb-24': showBottomNav }">
      <slot />
      <div v-if="showBottomNav" class="pb-24"/>
    </main>
    <Footer v-if="!showBottomNav" />
    <BottomNav v-if="showBottomNav" />
  </div>
</template>

<script setup lang="ts">
import { Header, Footer, BottomNav } from '#components'
import { computed } from 'vue'

const { $pwa } = useNuxtApp()

const isMobile = computed(() => {
  if (process.client) {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768
  }
  return false
})

const showBottomNav = computed(() => {
  const isPWA = process.client && $pwa?.isPWAInstalled
  return isPWA && isMobile.value
})

definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
</style>