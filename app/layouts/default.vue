<template>
  <div class="layout">
    <Header v-if="!showBottomNav"/>
    <!-- <PwaTopNav v-if="showBottomNav" /> -->

    <!-- Put pt-14 in thing below -->
    <main :class="{ 'pb-24': showBottomNav, '': showBottomNav }">
      <slot />
      <div v-if="showBottomNav" class="pb-24"/>
    </main>
    <Footer v-if="!showBottomNav" />
    <PwaBottomNav v-if="showBottomNav" />
  </div>
</template>

<script setup lang="ts">
import { Header, Footer, PwaTopNav, PwaBottomNav } from '#components'
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