<script lang="ts" setup>

const props = defineProps({
  title: String,
  subtitle: String
})

</script>

<template>
  <section class="bg-stone-100 border-b border-stone-200 py-12">
    <div class="container mx-auto max-w-5xl px-4 text-center space-y-6">
      <h1 class="text-4xl md:text-6xl font-bold text-stone-800">{{ props.title }}</h1>
      <svg class="w-28 h-auto mx-auto text-amber-600" viewBox="0 0 100 12" fill="none">
        <path d="M0 5 H50 C75 5 75 0 100 5" stroke="currentColor" stroke-width="2" />
      </svg>
      <p class="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto">{{ props.subtitle }}</p>
    </div>
  </section>
</template>

<style></style>