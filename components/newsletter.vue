<template>
    <!-- Enhanced Newsletter Section -->
    <div
      class="w-full relative overflow-hidden bg-gradient-to-br from-[#8B4513]/5  to-amber-800/10 bg-[#8B4513]/5  py-20 px-4 sm:px-8 flex flex-col items-center text-center gap-10">

      <!-- Content -->
      <div class="space-y-6 max-w-4xl z-10">
        <div class="space-y-4">
          <h2 class="text-4xl md:text-6xl text-stone-800 font-bold leading-tight tracking-tight">
            Stay Connected
          </h2>
          <svg class="w-32 h-auto mx-auto text-amber-600" viewBox="0 0 100 10" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M0 5 H50 C75 5 75 0 100 5" stroke="currentColor" stroke-width="2" />
          </svg>
        </div>
        <p class="text-xl md:text-2xl text-stone-800 leading-relaxed font-light">
          Receive updates on services, events, and spiritual reflections directly to your inbox.
        </p>
        <p class="text-base md:text-lg text-stone-500 leading-relaxed max-w-2xl mx-auto">
          Join our growing community of faithful subscribers and never miss important parish announcements, upcoming
          feast days, or inspiring articles from our clergy.
        </p>
      </div>

      <!-- Enhanced Newsletter Form -->
      <div class="w-full max-w-2xl z-10 space-y-6">
        <form class="flex flex-col sm:flex-row gap-4 items-stretch" @submit.prevent>
          <div class="flex-1 relative group">
            <UInput type="email" placeholder="Enter your email address"
              class="w-full bg-white/95 backdrop-blur-sm text-stone-800 font-medium rounded-full shadow-lg hover:shadow-lg  placeholder:text-stone-500 group-hover:bg-white transition-colors duration-300" />
          </div>
          <UButton
            class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg tracking-wide group whitespace-nowrap"
            type="submit">
            <span class="transition-transform duration-300 flex items-center gap-2 font-normal">
              Subscribe Now
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3">
                </path>
              </svg>
            </span>
          </UButton>
        </form>

      </div>
    </div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>