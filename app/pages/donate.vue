<script setup lang="ts">
const { data: donatePage } = await useAsyncData(() =>
  queryCollection('pages').path('/pages/donate').first()
)
useSeoMeta({
  title: 'Support Our Parish - Donations Coming Soon',
  description: 'Learn about upcoming donation opportunities to support our Orthodox parish community.',
})
</script>

<template>
  <div>
    <HeroLowImpact :title="donatePage?.title" :subtitle="donatePage?.subTitle" />
    <!-- Donations Status -->
    <section class="container mx-auto max-w-4xl px-4 py-16">
      <div class="bg-white border border-stone-200 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col gap-8">
        <h2 class="text-3xl md:text-4xl font-bold text-stone-800 text-center">
          Now Accepting Donations
        </h2>
        <p class="text-lg text-stone-600 text-center max-w-2xl mx-auto">
          Our 501c3 non-profit filing has been finalized & your donations are now tax deductible! Your gifts will directly support our parish’s growth and mission.
        </p>

        <NuxtLink to="https://donate.nativityofthemotherofgod.com/b/14A6oJakr1TD3Zs7DBeQM00"
          class="text-xl text-center transition-all duration-300 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 h-auto rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium">
          Donate
        </NuxtLink>


      </div>
    </section>
  </div>
</template>

<style scoped>
input:focus {
  outline: none;
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}

.border-red-500 {
  border-color: #ef4444;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
