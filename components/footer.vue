<template>
  <footer class="w-full bg-white border-t border-stone-200/30 accentedBg">
    <div class="container mx-auto max-w-full md:max-w-7xl px-4 sm:px-8 md:px-12 py-6 md:py-12">
      <!-- Main Content -->
      <div class="text-center space-y-8">
        <!-- Logo and Title -->
        <div class="flex items-center justify-center gap-4">
          <img src="/logo2.png" class="h-12 object-contain" alt="Parish Logo" />
          <div class="text-left">
            <h3 class="text-xl font-bold text-stone-800 leading-tight tracking-tight">
              Nativity of the Mother of God
            </h3>
            <p class="text-sm text-stone-600">
              Old Rite Orthodox Church in Woodburn, OR
            </p>
          </div>
        </div>


        <!-- Service Times -->
        <div class="max-w-2xl mx-auto">
          <h4 class="text-xl font-semibold text-stone-800 mb-4">Service Times</h4>
          <div class="grid grid-cols-1 md:grid-cols-1 gap-4 text-md text-stone-600">
            <div class="flex justify-between">
              <span>Divine Liturgy</span>
              <span>Sundays at 9:00 AM</span>
            </div>
            <div class="flex justify-between">
              <span>Vespers</span>
              <span>Saturdays at 6:00 PM</span>
            </div>

            <div class="flex justify-between">
              <span>Office Hours</span>
              <span>Mon-Fri, 9:00 AM - 3:00 PM</span>
            </div>
          </div>
        </div>

        <!-- Donate Button -->
        <div>
          <RouterLink 
            to="/donate"
            class="inline-block bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg tracking-wide group mb-16"
          >
            <span class="group-hover:scale-105 transition-transform duration-300">Support Our Parish</span>
          </RouterLink>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t border-stone-200/50 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- Copyright -->
        <p class="text-stone-500 text-sm text-center md:text-left">
          © 2025 Nativity of the Mother of God Orthodox Church. All rights reserved.
        </p>
        
        <!-- Links -->
        <div class="flex gap-6 text-sm">
          <RouterLink 
            to="/privacy" 
            class="text-stone-500 hover:text-amber-600 transition-colors duration-300"
          >
            Privacy
          </RouterLink>
          <RouterLink 
            to="/terms" 
            class="text-stone-500 hover:text-amber-600 transition-colors duration-300"
          >
            Terms
          </RouterLink>
          <RouterLink 
            to="/contact" 
            class="text-stone-500 hover:text-amber-600 transition-colors duration-300"
          >
            Contact
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
/* Clean and minimal - no additional styles needed */
</style>