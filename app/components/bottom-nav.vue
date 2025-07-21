<template>
      <div class="fixed bottom-0 left-0 right-0 h-20 pointer-events-none z-20 bg-gradient-to-t from-black/30 to-transparent" />

  <nav class="fixed bottom-4 left-4 right-4 z-100 safe-area-mb">
    <!-- Nav Bar -->
    <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-stone-200/50 mx-auto">
      <div class="flex items-center p-2 min-w-0 gap-2">
        <!-- Home -->
        <BottomNavItem
          to="/"
          label="Home"
          icon-active="heroicons:home-solid"
          icon-inactive="heroicons:home"
        />

        <!-- Schedule -->
        <BottomNavItem
          to="/schedule"
          label="Schedule"
          icon-active="heroicons:calendar-days-solid"
          icon-inactive="heroicons:calendar-days"
        />

        <!-- Articles -->
        <BottomNavItem
          to="/articles"
          label="Articles"
          icon-active="heroicons:document-text-solid"
          icon-inactive="heroicons:document-text"
        />

        <!-- Account/Sign In -->
        <BottomNavItem
          :to="isAuthenticated ? '/account' : '/login'"
          :label="isAuthenticated ? 'Account' : 'Sign In'"
          icon-active="heroicons:user-solid"
          icon-inactive="heroicons:user"
          :auth-routes="['/account', '/login']"
        />

        <!-- Directory button -->
        <BottomNavItem
          is-button
          :on-click="toggleMenu"
          :is-menu-open="isMenuOpen"
          is-directory
          :directory-routes="directoryRoutes"
          label="Directory"
          icon-active="heroicons:x-mark-solid"
          icon-inactive="heroicons:bars-3"
        />
      </div>
    </div>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform translate-y-4 scale-95"
      enter-to-class="opacity-100 transform translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0 scale-100"
      leave-to-class="opacity-0 transform translate-y-4 scale-95"
    >
      <div
        v-if="isMenuOpen"
        class="absolute bottom-full mb-3 left-0 right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-stone-200/50 mx-auto"
      >
        <div class="py-2 px-2">
          <RouterLink
            v-for="item in directoryItems"
            :key="item.to"
            :to="item.to"
            @click="closeMenu"
            class="flex items-center p-4 rounded-xl text-stone-700 transition-colors duration-200"
          >
            <div class="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center mr-4">
              <Icon :name="item.icon" class="w-5 h-5 text-stone-600" />
            </div>
            <span class="font-medium">{{ item.label }}</span>
          </RouterLink>
        </div>
      </div>
    </Transition>

    <!-- Bottom gradient overlay -->
  </nav>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'

const route = useRoute()
const isMenuOpen = ref(false)
const { isAuthenticated } = useFirebaseAuth()

const directoryItems = [
  { to: '/about', label: 'About Us', icon: 'heroicons:cog-6-tooth' },
  { to: '/videos', label: 'Videos', icon: 'heroicons:video-camera' },
  { to: '/timeline', label: 'Timeline', icon: 'heroicons:shield-check' },
]

const directoryRoutes = directoryItems.map(item => item.to)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// Auto-close when route changes
watch(() => route.path, closeMenu)

// Auto-close when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('nav')) {
      closeMenu()
    }
  })
})
</script>

<style scoped>
.safe-area-mb {
  margin-bottom: env(safe-area-inset-bottom);
}
</style>