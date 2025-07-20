<template>
  <div class="layout">
    <Header/>
    <main :class="{ 'pb-20': showBottomNav }">
      <slot />
    </main>
    <Footer v-if="!showBottomNav" />
    <BottomNav v-if="showBottomNav" />
  </div>
</template>

<script setup>
import { Header, Footer, BottomNav } from '#components';

const { $pwa } = useNuxtApp();

// Mobile detection composable or utility
const isMobile = computed(() => {
  if (process.client) {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
  }
  return false;
});

const showBottomNav = computed(() => {
  return process.client && $pwa?.isPWAInstalled && isMobile.value;
});

definePageMeta({
  layout: 'default'
})
</script>