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
    <HeroLowImpact :title="donatePage?.title" :subtitle="donatePage?.subTitle"/>
    <!-- Donations Status -->
    <section class="container mx-auto max-w-4xl px-4 py-16">
      <div class="bg-white border border-stone-200 rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
        <h2 class="text-3xl md:text-4xl font-bold text-stone-800 text-center">
          Donations Coming Soon
        </h2>
        <p class="text-lg text-stone-600 text-center max-w-2xl mx-auto">
          We’re finalizing our nonprofit status to make sure your donations are tax-deductible.
          Once approved, your gifts will directly support our parish’s growth and mission.
        </p>

        <!-- Progress Bar -->
        <div class="space-y-4">
          <div class="flex justify-between text-sm text-stone-600">
            <span>Application Submitted</span>
            <span>Approval Pending</span>
            <span>Ready for Donations</span>
          </div>
          <div class="relative">
            <div class="w-full bg-stone-200 h-2 rounded-full">
              <div class="bg-amber-500 h-2 rounded-full transition-all duration-500" style="width: 65%"></div>
            </div>
            <div class="absolute top-0 left-0 w-full flex justify-between">
              <div class="w-4 h-4 bg-amber-500 rounded-full -translate-y-1"></div>
              <div class="w-4 h-4 bg-amber-500 rounded-full -translate-y-1"></div>
              <div class="w-4 h-4 bg-stone-300 rounded-full -translate-y-1"></div>
            </div>
          </div>
        </div>

        
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
