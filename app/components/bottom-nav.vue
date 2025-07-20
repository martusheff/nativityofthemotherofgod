<template>
  <nav class="fixed bottom-4 left-4 right-4 z-50 safe-area-mb">
    <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-stone-200/50 mx-auto">
      <div class="flex items-center py-3 px-2">
        <!-- Home -->
        <RouterLink
          to="/"
          class="flex flex-col items-center justify-center py-3 px-3 rounded-xl transition-all duration-300 flex-1"
          :class="isActive('/') ? activeTabClasses : inactiveTabClasses"
        >
          <Icon :name="isActive('/') ? 'heroicons:home-solid' : 'heroicons:home'" class="w-6 h-6 mb-1" />
          <span class="text-xs font-medium">Home</span>
        </RouterLink>

        <!-- Calendar -->
        <RouterLink
          to="/schedule"
          class="flex flex-col items-center justify-center py-3 px-3 rounded-xl transition-all duration-300 flex-1"
          :class="isActive('/schedule') ? activeTabClasses : inactiveTabClasses"
        >
          <Icon :name="isActive('/schedule') ? 'heroicons:calendar-days-solid' : 'heroicons:calendar-days'" class="w-6 h-6 mb-1" />
          <span class="text-xs font-medium">Calendar</span>
        </RouterLink>

        <!-- Articles -->
        <RouterLink
          to="/articles"
          class="flex flex-col items-center justify-center py-3 px-3 rounded-xl transition-all duration-300 flex-1"
          :class="isActive('/articles') ? activeTabClasses : inactiveTabClasses"
        >
          <Icon :name="isActive('/articles') ? 'heroicons:document-text-solid' : 'heroicons:document-text'" class="w-6 h-6 mb-1" />
          <span class="text-xs font-medium">Articles</span>
        </RouterLink>

        <!-- Account -->
        <RouterLink
          to="/account"
          class="flex flex-col items-center justify-center py-3 px-3 rounded-xl transition-all duration-300 flex-1"
          :class="isActive('/account') ? activeTabClasses : inactiveTabClasses"
        >
          <Icon :name="isActive('/account') ? 'heroicons:user-solid' : 'heroicons:user'" class="w-6 h-6 mb-1" />
          <span class="text-xs font-medium">Account</span>
        </RouterLink>

        <!-- Directory -->
        <button
          @click="toggleMenu"
          class="flex flex-col items-center justify-center py-3 px-3 rounded-xl transition-all duration-300 flex-1"
          :class="isDirectoryActive ? activeTabClasses : inactiveTabClasses"
        >
          <Icon
            :name="isMenuOpen ? 'heroicons:x-mark-solid' : 'heroicons:bars-3'"
            class="w-6 h-6 mb-1 transition-transform duration-300"
            :class="{ 'rotate-180': isMenuOpen }"
          />
          <span class="text-xs font-medium">Directory</span>
        </button>
      </div>
    </div>

    <!-- Dropdown Menu -->
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
            class="flex items-center p-4 rounded-xl text-stone-700  transition-colors duration-200"
          >
            <div class="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center mr-4">
              <Icon :name="item.icon" class="w-5 h-5 text-stone-600" />
            </div>
            <span class="font-medium">{{ item.label }}</span>
          </RouterLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)

// Base nav tab classes
const activeTabClasses = 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg'
const inactiveTabClasses = 'text-stone-600'

// Directory items
const directoryItems = [
  { to: '/about', label: 'About Us', icon: 'heroicons:cog-6-tooth' },
  { to: '/videos', label: 'Videos', icon: 'heroicons:video-camera' },
  { to: '/timeline', label: 'Timeline', icon: 'heroicons:shield-check' },
]

// Check if given path is active
const isActive = (path: string): boolean => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// Check if any directory item is active
const isDirectoryActive = computed(() =>
  directoryItems.some(item => isActive(item.to))
)

// Toggle
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// Close
const closeMenu = () => {
  isMenuOpen.value = false
}

// Close on route change
watch(() => route.path, closeMenu)

// Close when clicking outside nav
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
