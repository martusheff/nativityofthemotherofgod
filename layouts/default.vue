<template>
  <div class="layout">
    <!-- <Header /> -->
    <main>
      <slot />
    </main>
    <!-- <Footer /> -->
  </div>
</template>

<script setup>

definePageMeta({
  layout: 'default'
})
</script>

