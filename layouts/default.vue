<template>
  <div class="layout">
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from '~/components/header.vue';


definePageMeta({
  layout: 'default'
})
</script>

