<template>
    <footer class="w-full bg-stone-50 border-t border-stone-200/50">
        <div class="w-full mx-auto max-w-5xl px-4 sm:px-8 md:px-12 py-12 space-y-12">
            <!-- Main Content -->
            <div class="flex flex-col md:flex-row justify-around gap-12 sm:gap-24 md:gap-40">
                <!-- Parish Info -->
                <div class="space-y-6">
                    <div class="flex flex-col md:flex-row items-center md:items-start gap-4">
                        <img src="/logo2.png" class="h-14 object-contain" alt="Parish Logo" />
                        <div class="text-center md:text-left">
                            <h3 class="text-2xl font-bold text-stone-800 leading-tight">
                                Nativity of the Mother of God
                            </h3>
                            <p class="text-stone-600 text-sm">
                                Old Rite Orthodox Church · Woodburn, OR
                            </p>
                        </div>
                    </div>

                    <div class="text-center sm:text-left">
                        <p class="text-stone-600 leading-relaxed text-md px-4">
                            A traditional Orthodox community celebrating the ancient faith with reverence and devotion.
                            Join us for worship, fellowship, and spiritual growth in the heart of Woodburn.
                        </p>
                    </div>


                </div>

                <!-- Navigation Links -->
                <div
                    class="space-y-6  w-full md:w-64 flex flex-col justify-center items-center md:items-end md:justify-end text-center md:text-right  ">
                    <h4 class="text-lg font-semibold text-stone-800">Quick Links</h4>
                    <nav class="space-y-3">
                        <RouterLink to="/"
                            class="block text-stone-600 hover:text-amber-600 transition-colors duration-300 text-lg">
                            Home
                        </RouterLink>
                        <RouterLink to="/videos"
                            class="block text-stone-600 hover:text-amber-600 transition-colors duration-300 text-lg">
                            Videos
                        </RouterLink>
                        <RouterLink to="/timeline"
                            class="block text-stone-600 hover:text-amber-600 transition-colors duration-300 text-lg">
                            Timeline
                        </RouterLink>
                        <RouterLink to="/schedule"
                            class="block text-stone-600 hover:text-amber-600 transition-colors duration-300 text-lg">
                            Service Schedule
                        </RouterLink>
                        <RouterLink to="/contact"
                            class="block text-stone-600 hover:text-amber-600 transition-colors duration-300 text-lg">
                            Contact Us
                        </RouterLink>

                    </nav>
                </div>


            </div>



            <!-- Bottom Bar -->
            <div class="border-t border-stone-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-sm text-stone-500 text-center md:text-left">
                    © 2025 Nativity of the Mother of God Orthodox Church · All rights reserved.
                </p>
                <div class="flex gap-6 text-sm">
                    <RouterLink to="#" class="text-stone-500 hover:text-amber-600 transition-colors duration-300">
                        Privacy Policy
                    </RouterLink>
                    <RouterLink to="#" class="text-stone-500 hover:text-amber-600 transition-colors duration-300">
                        Terms of Service
                    </RouterLink>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
/* Optional: Add a subtle gradient background */
footer {
    background: linear-gradient(to bottom, #fafaf9, #f7f7f6);
}

/* Ensure consistent hover effects */
nav a:hover {
    transform: translateX(2px);
}
</style>