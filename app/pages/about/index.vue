<template>
  <div>
    <HeroLowImpact title="About Our Parish" 
      subtitle="We are the Nativity of the Mother of God Old Rite Russian Orthodox Church, a new community under ROCOR, faithfully following the Old Calendar. If you are inquiring as a new visitor please contact Fr. Nikita."/>
    <About/>
    <p v-if="$pwa?.isPWAInstalled">USING PWA</p>
  </div>
</template>

<script lang="ts" setup>
import About from './_components/about.vue';
const { $pwa } = useNuxtApp()
</script>