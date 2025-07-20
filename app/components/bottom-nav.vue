<template>
  <nav class="fixed bottom-4 left-4 right-4 z-50 safe-area-mb">
    <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-stone-200/50 mx-auto">
      <div class="flex items-center py-3 px-2">
        <!-- Home -->
        <RouterLink 
          to="/" 
          class="flex flex-col items-center justify-center py-3 px-3 rounded-xl transition-all duration-300 flex-1"
          :class="isActive('/') ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg' : 'text-stone-600'"
        >
          <Icon 
            :name="isActive('/') ? 'heroicons:home-solid' : 'heroicons:home'" 
            class="w-6 h-6 mb-1" 
          />
          <span class="text-xs font-medium">Home</span>
        </RouterLink>

        <!-- Calendar -->
        <RouterLink 
          to="/schedule" 
          class="flex flex-col items-center justify-center py-3 px-3 rounded-xl transition-all duration-300 flex-1"
          :class="isActive('/schedule') ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg' : 'text-stone-600'"
        >
          <Icon 
            :name="isActive('/schedule') ? 'heroicons:calendar-days-solid' : 'heroicons:calendar-days'" 
            class="w-6 h-6 mb-1" 
          />
          <span class="text-xs font-medium">Calendar</span>
        </RouterLink>

        <!-- Articles -->
        <RouterLink 
          to="/articles" 
          class="flex flex-col items-center justify-center py-3 px-3 rounded-xl transition-all duration-300 flex-1"
          :class="isActive('/articles') ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg' : 'text-stone-600'"
        >
          <Icon 
            :name="isActive('/articles') ? 'heroicons:document-text-solid' : 'heroicons:document-text'" 
            class="w-6 h-6 mb-1" 
          />
          <span class="text-xs font-medium">Articles</span>
        </RouterLink>

        <!-- Account -->
        <RouterLink 
          to="/account" 
          class="flex flex-col items-center justify-center py-3 px-3 rounded-xl transition-all duration-300 flex-1"
          :class="isActive('/account') ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg' : 'text-stone-600'"
        >
          <Icon 
            :name="isActive('/account') ? 'heroicons:user-solid' : 'heroicons:user'" 
            class="w-6 h-6 mb-1" 
          />
          <span class="text-xs font-medium">Account</span>
        </RouterLink>

        <!-- Directory (Hamburger Menu) -->
        <button 
          @click="toggleMenu"
          class="flex flex-col items-center justify-center py-3 px-3 rounded-xl transition-all duration-300 flex-1"
          :class="isMenuOpen ? ' ' : 'text-stone-600'"
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
      <div v-if="isMenuOpen" class="absolute bottom-full mb-3 left-0 right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-stone-200/50  mx-auto">
        <div class="py-4 px-4 space-y-1">
          <RouterLink 
            to="/" 
            @click="closeMenu"
            class="flex items-center p-4 rounded-xl text-stone-700 active:bg-amber-50 transition-colors duration-200"
          >
            <div class="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center mr-4">
              <Icon name="heroicons:shield-check" class="w-5 h-5 text-stone-600" />
            </div>
            <span class="font-medium">Privacy Policy</span>
          </RouterLink>
          
          <RouterLink 
            to="/" 
            @click="closeMenu"
            class="flex items-center p-4 rounded-xl text-stone-700 active:bg-amber-50 transition-colors duration-200"
          >
            <div class="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center mr-4">
              <Icon name="heroicons:document-text" class="w-5 h-5 text-stone-600" />
            </div>
            <span class="font-medium">Terms of Service</span>
          </RouterLink>
          
          <RouterLink 
            to="/" 
            @click="closeMenu"
            class="flex items-center p-4 rounded-xl text-stone-700 active:bg-amber-50 transition-colors duration-200"
          >
            <div class="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center mr-4">
              <Icon name="heroicons:question-mark-circle" class="w-5 h-5 text-stone-600" />
            </div>
            <span class="font-medium">Help & Support</span>
          </RouterLink>
          
          <RouterLink 
            to="/" 
            @click="closeMenu"
            class="flex items-center p-4 rounded-xl text-stone-700 active:bg-amber-50 transition-colors duration-200"
          >
            <div class="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center mr-4">
              <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 text-stone-600" />
            </div>
            <span class="font-medium">Settings</span>
          </RouterLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const route = useRoute()
const isMenuOpen = ref(false)

const isActive = (path: string): boolean => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// Close menu when route changes
watch(() => route.path, () => {
  closeMenu()
})

// Close menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
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