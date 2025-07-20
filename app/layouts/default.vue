<template>
  <div class="layout">
    <Header/>
    <main>
      <slot />
    </main>
    <Footer/>
  </div>
</template>

<script setup>
import { Header, Footer } from '#components';


definePageMeta({
  layout: 'default'
})
</script>

