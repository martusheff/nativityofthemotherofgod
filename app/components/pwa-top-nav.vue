<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200/50 safe-area-pt">
    <div class="flex items-center justify-between px-4 h-14">
      <!-- Back button (when applicable) -->
      <button 
        v-if="showBackButton"
        @click="goBack"
        class="flex items-center justify-center w-10 h-10 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors duration-200"
      >
        <Icon name="heroicons:arrow-left" class="w-5 h-5" />
      </button>
      
      <!-- Current page info -->
      <div class="flex items-center flex-1" :class="showBackButton ? 'ml-3' : ''">
        <div v-if="currentPageInfo.icon" class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg mr-3">
          <Icon :name="currentPageInfo.icon" class="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 class="text-lg font-semibold text-stone-900 leading-tight">
            {{ currentPageInfo.title }}
          </h1>
          <p v-if="currentPageInfo.subtitle" class="text-xs text-stone-500 leading-none">
            {{ currentPageInfo.subtitle }}
          </p>
        </div>
      </div>

      <!-- Action button (notifications, search, etc.) -->
      <button 
        v-if="currentPageInfo.action"
        @click="currentPageInfo.action.onClick"
        class="flex items-center justify-center w-10 h-10 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors duration-200"
      >
        <Icon :name="currentPageInfo.action.icon" class="w-5 h-5" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNavigationStore } from '~/stores/navigation'

const router = useRouter()
const navigationStore = useNavigationStore()

// Define the type for page configuration
interface PageAction {
  icon: string
  onClick: () => void
}

interface PageConfig {
  title: string
  icon: string
  subtitle: string
  action?: PageAction
}

// Define page configurations with proper typing
const pageConfigs: Record<string, PageConfig> = {
  '/': {
    title: 'Home',
    icon: 'heroicons:home-solid',
    subtitle: 'Welcome back',
    action: {
      icon: 'heroicons:bell',
      onClick: () => console.log('')
    }
  },
  '/schedule': {
    title: 'Calendar',
    icon: 'heroicons:calendar-days-solid',
    subtitle: 'Your schedule'
  },
  '/articles': {
    title: 'Articles',
    icon: 'heroicons:document-text-solid',
    subtitle: 'Latest posts'
  },
  '/account': {
    title: 'Account',
    icon: 'heroicons:user-solid',
    subtitle: 'Profile & settings'
  },
  '/login': {
    title: 'Sign In',
    icon: 'heroicons:user',
    subtitle: 'Welcome'
  },
  '/about': {
    title: 'About Us',
    icon: 'heroicons:cog-6-tooth',
    subtitle: 'Learn more'
  },
  '/videos': {
    title: 'Videos',
    icon: 'heroicons:video-camera',
    subtitle: 'Watch & learn'
  },
  '/timeline': {
    title: 'Timeline',
    icon: 'heroicons:shield-check',
    subtitle: 'Our journey'
  }
}

// Get current page info based on route
const currentPageInfo = computed((): PageConfig => {
  const currentPath = navigationStore.currentRoute
  
  // Check for exact match first
  const exactConfig = pageConfigs[currentPath]
  if (exactConfig) {
    return exactConfig
  }
  
  // Check for partial matches (e.g., /articles/123 should match /articles)
  const matchingPath = Object.keys(pageConfigs).find(path => 
    path !== '/' && currentPath.startsWith(path)
  )
  
  if (matchingPath) {
    const config = pageConfigs[matchingPath]
    if (config) {
      return {
        ...config,
        subtitle: config.subtitle || 'Details'
      }
    }
  }
  
  // Fallback for unknown routes
  return {
    title: 'Page',
    icon: 'heroicons:document',
    subtitle: 'Unknown page'
  }
})

// Show back button for non-main navigation routes
const showBackButton = computed(() => {
  const currentPath = navigationStore.currentRoute
  const isMainRoute = navigationStore.allNavItems.some(item => 
    item.to === currentPath || (item.to === '/' && currentPath === '/')
  )
  const isDirectoryRoute = navigationStore.isDirectoryRoute
  
  return !isMainRoute || isDirectoryRoute
})

// Back button handler
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.safe-area-pt {
  padding-top: env(safe-area-inset-top);
}
</style>