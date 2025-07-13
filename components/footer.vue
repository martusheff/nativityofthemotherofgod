<template>
  <footer class="w-full bg-gradient-to-br from-[#8B4513]/5 to-amber-800/10 border-t border-stone-200/30">
    <div class="container mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
      <!-- Logo & Identity -->
       
      <div class="col-span-2 flex flex-col w-full justify-center items-center md:items-start gap-4 text-center md:text-left">
        <h3 class="text-3xl max-w-sm font-bold text-stone-800 tracking-tight">
          Church of the Nativity of the Mother of God
        </h3>
        <p class="text-sm text-stone-600">
          Old Rite Orthodox Church <br />Woodburn, OR
        </p>
        <!-- CTA Buttons stacked under logo on mobile -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
          <RouterLink
            to="/donate"
            class="inline-block bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-2 px-6 rounded-full shadow hover:shadow-lg transition-all duration-300 text-lg tracking-wide"
          >
            Support Our Parish
          </RouterLink>
          <RouterLink
            to="/contact"
            class="inline-block border border-stone-300 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 font-medium py-2 px-6 rounded-full shadow hover:shadow-md transition-all duration-300 text-lg tracking-wide"
          >
            Get in Touch
          </RouterLink>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
        <h4 class="text-2xl font-semibold text-stone-800">Quick Links</h4>
        <RouterLink
          to="/"
          class="text-lg text-stone-600 hover:text-amber-600 transition-colors duration-300"
        >Home</RouterLink>
        <RouterLink
          to="/calendar"
          class="text-lg text-stone-600 hover:text-amber-600 transition-colors duration-300"
        >Church Calendar</RouterLink>
        <RouterLink
          to="/articles"
          class="text-lg text-stone-600 hover:text-amber-600 transition-colors duration-300"
        >Articles</RouterLink>
        <RouterLink
          to="/donate"
          class="text-lg text-stone-600 hover:text-amber-600 transition-colors duration-300"
        >Donate</RouterLink>
        <RouterLink
          to="/contact"
          class="text-lg text-stone-600 hover:text-amber-600 transition-colors duration-300"
        >Contact</RouterLink>
      </div>

      <!-- Service Times -->
      <div class="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
        <h4 class="text-2xl font-semibold text-stone-800">Service Times</h4>
        <div class="text-lg text-stone-600">
          <p><span class="font-medium text-stone-800">Divine Liturgy:</span> Sundays · 8:30 AM</p>
          <p><span class="font-medium text-stone-800">Vespers:</span> Saturdays · 5:00 PM</p>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-stone-200/50 py-6 px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
      <p class="text-xs text-stone-500">
        © 2025 Nativity of the Mother of God Orthodox Church · All rights reserved.
      </p>
      <div class="flex gap-6 text-xs text-stone-500">
        <RouterLink
          to="/privacy"
          class="hover:text-amber-600 transition-colors duration-300"
        >Privacy</RouterLink>
        <RouterLink
          to="/terms"
          class="hover:text-amber-600 transition-colors duration-300"
        >Terms</RouterLink>
        <RouterLink
          to="/contact"
          class="hover:text-amber-600 transition-colors duration-300"
        >Contact</RouterLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
/* No extra custom CSS needed — Tailwind handles it */
</style>
