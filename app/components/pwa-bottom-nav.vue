<template>
  <!-- Background gradient behind nav -->
  <div class="fixed bottom-0 left-0 right-0 h-20 pointer-events-none z-20 bg-gradient-to-t from-black/30 to-transparent" />

  <!-- Nav bar container -->
  <nav class="fixed bottom-4 left-4 right-4 z-100 safe-area-mb">
    <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-stone-200/50 mx-auto">
      <div class="flex items-center p-2 min-w-0">
        <!-- Main nav items -->
        <PwaBottomNavItem 
          v-for="item in navigationStore.allNavItems" 
          :key="item.to"
          :to="item.to" 
          :label="item.label" 
          :icon-active="item.iconActive" 
          :icon-inactive="item.iconInactive"
          :auth-routes="item.authRoutes"
        />

        <!-- Directory menu toggle -->
        <PwaBottomNavItem
          is-button
          :on-click="navigationStore.toggleMenu"
          :is-menu-open="navigationStore.isMenuOpen"
          is-directory
          :directory-routes="navigationStore.directoryRoutes"
          :label="navigationStore.directoryNavItem.label"
          :icon-active="navigationStore.directoryNavItem.iconActive"
          :icon-inactive="navigationStore.directoryNavItem.iconInactive"
        />
      </div>
    </div>

    <!-- Directory dropdown -->
    <Transition 
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform translate-y-4 scale-95"
      enter-to-class="opacity-100 transform translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0 scale-100"
      leave-to-class="opacity-0 transform translate-y-4 scale-95">
      <div
        v-if="navigationStore.isMenuOpen"
        class="absolute bottom-full mb-3 left-0 right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-stone-200/50 mx-auto max-w-md"
      >
        <div class="py-2 px-2">
          <RouterLink 
            v-for="item in navigationStore.directoryItems" 
            :key="item.to" 
            :to="item.to" 
            @click="navigationStore.closeMenu"
            class="flex items-center p-4 rounded-xl text-stone-700 transition-colors duration-200 hover:bg-stone-50 active:bg-stone-100"
          >
            <div class="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <Icon :name="item.icon" class="w-5 h-5 text-stone-600" />
            </div>
            <span class="font-medium truncate">{{ item.label }}</span>
          </RouterLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { PwaBottomNavItem } from '#components'
import { onMounted, onUnmounted } from 'vue'
import { useNavigationStore } from '~/stores/navigation'

const navigationStore = useNavigationStore()

onMounted(() => {
  navigationStore.initializeNavigation()
  document.addEventListener('click', navigationStore.handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', navigationStore.handleOutsideClick)
})
</script>

<style scoped>
.safe-area-mb {
  margin-bottom: env(safe-area-inset-bottom);
}
</style>
