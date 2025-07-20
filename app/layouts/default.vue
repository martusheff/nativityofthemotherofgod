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

<script setup>
import { Header, Footer, BottomNav } from '#components'

const { $pwa } = useNuxtApp()

const isMobile = computed(() => {
  if (process.client) {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
  }
  return false
})

const showBottomNav = computed(() => {
  return process.client && $pwa?.isPWAInstalled && isMobile.value
})

definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
/* Make a reusable safe-area padding */
.pb-safe-nav {
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}
</style>
