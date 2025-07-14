<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: string
  class?: string
}>(), {
  size: 'text-5xl'
})
</script>

<template>
  <div :class="['flex items-center justify-center w-full my-12', props.class]">
    <!-- Left curved line -->
    <svg class="flex-1 h-4" viewBox="0 0 200 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 5 H100 C150 5 150 0 200 5" stroke="url(#gradL)" stroke-width="1" />
      <defs>
        <linearGradient id="gradL" x1="0" y1="0" x2="200" y2="0">
          <stop offset="0%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#d97706" />
        </linearGradient>
      </defs>
    </svg>
    
    <!-- Icon -->
    <span
      :class="[
        props.size,
        'mx-4 bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent flex-shrink-0'
      ]"
    >
      ☦︎
    </span>

    <!-- Right curved line (mirrored) -->
    <svg class="flex-1 h-4" viewBox="0 0 200 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 5 C50 0 50 5 100 5 H200" stroke="url(#gradR)" stroke-width="1" />
      <defs>
        <linearGradient id="gradR" x1="0" y1="0" x2="200" y2="0">
          <stop offset="0%" stop-color="#d97706" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>