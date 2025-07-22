// stores/navigation.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBaseStore } from './baseStore'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'

export interface NavigationItem {
  to: string
  label: string
  iconActive: string
  iconInactive: string
  authRoutes?: string[]
}

export interface DirectoryItem {
  to: string
  label: string
  icon: string
}

export const useNavigationStore = defineStore('navigation', () => {
  // Compose base store functionality (minimal usage for navigation)
  const baseStore = useBaseStore({
    cacheDuration: 30 * 60 * 1000, // 30 minutes
    errorTimeout: 3000,
    messageTimeout: 2000
  })

  // Navigation-specific state
  const isMenuOpen = ref(false)
  
  // Static directory items from your existing code
  const directoryItems = ref<DirectoryItem[]>([
    { to: '/about', label: 'About Us', icon: 'heroicons:cog-6-tooth' },
    { to: '/videos', label: 'Videos', icon: 'heroicons:video-camera' },
    { to: '/timeline', label: 'Timeline', icon: 'heroicons:shield-check' },
  ])

  // Main nav items matching your existing BottomNav structure
  const mainNavItems = ref<NavigationItem[]>([
    {
      to: '/',
      label: 'Home',
      iconActive: 'heroicons:home-solid',
      iconInactive: 'heroicons:home'
    },
    {
      to: '/schedule',
      label: 'Calendar',
      iconActive: 'heroicons:calendar-days-solid',
      iconInactive: 'heroicons:calendar-days'
    },
    {
      to: '/articles',
      label: 'Articles',
      iconActive: 'heroicons:document-text-solid',
      iconInactive: 'heroicons:document-text'
    }
  ])

  // Computed properties
  const route = useRoute()
  const { isAuthenticated } = useFirebaseAuth()

  const currentRoute = computed(() => route.path)
  
  // Auth nav item that changes based on authentication status
  const authNavItem = computed((): NavigationItem => ({
    to: isAuthenticated.value ? '/account' : '/login',
    label: isAuthenticated.value ? 'Account' : 'Sign In',
    iconActive: 'heroicons:user-solid',
    iconInactive: 'heroicons:user',
    authRoutes: ['/account', '/login'] // Routes that should show as active
  }))

  // Directory menu nav item (the hamburger/X button)
  const directoryNavItem = computed(() => ({
    label: 'Directory',
    iconActive: 'heroicons:x-mark-solid',
    iconInactive: 'heroicons:bars-3',
    isButton: true,
    isDirectory: true,
    directoryRoutes: directoryRoutes.value
  }))

  const directoryRoutes = computed(() => directoryItems.value.map(item => item.to))

  // All main navigation items (for the bottom nav bar)
  const allNavItems = computed(() => [
    ...mainNavItems.value,
    authNavItem.value
  ])

  // Check if current route is in directory routes
  const isDirectoryRoute = computed(() => {
    return directoryRoutes.value.some(path => route.path.startsWith(path))
  })

  // PWA TopNav helper computed properties
  const currentPageTitle = computed(() => {
    // Check main nav items
    const mainNavItem = allNavItems.value.find(item => {
      if (item.to === '/' && route.path === '/') return true
      return item.to !== '/' && route.path.startsWith(item.to)
    })
    
    if (mainNavItem) return mainNavItem.label

    // Check directory items
    const directoryItem = directoryItems.value.find(item => 
      route.path.startsWith(item.to)
    )
    
    if (directoryItem) return directoryItem.label

    // Fallback
    return 'Page'
  })

  // Check if current route is a main navigation route
  const isMainNavigationRoute = computed(() => {
    return allNavItems.value.some(item => 
      item.to === route.path || (item.to === '/' && route.path === '/')
    )
  })

  // Get the appropriate icon for current route
  const currentPageIcon = computed(() => {
    // Check main nav items
    const mainNavItem = allNavItems.value.find(item => {
      if (item.to === '/' && route.path === '/') return true
      return item.to !== '/' && route.path.startsWith(item.to)
    })
    
    if (mainNavItem) return mainNavItem.iconActive

    // Check directory items
    const directoryItem = directoryItems.value.find(item => 
      route.path.startsWith(item.to)
    )
    
    if (directoryItem) return directoryItem.icon

    // Fallback
    return 'heroicons:document'
  })

  // Get current page subtitle based on route
  const currentPageSubtitle = computed(() => {
    const subtitles: Record<string, string> = {
      '/': 'Welcome back',
      '/schedule': 'Your schedule',
      '/articles': 'Latest posts',
      '/account': 'Profile & settings',
      '/login': 'Welcome',
      '/about': 'Learn more',
      '/videos': 'Watch & learn',
      '/timeline': 'Our journey'
    }

    // Check for exact match first
    if (subtitles[route.path]) {
      return subtitles[route.path]
    }
    
    // Check for partial matches (e.g., /articles/123 should match /articles)
    const matchingPath = Object.keys(subtitles).find(path => 
      path !== '/' && route.path.startsWith(path)
    )
    
    if (matchingPath) {
      return 'Details'
    }

    return ''
  })

  // Navigation actions
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }

  const closeMenu = () => {
    isMenuOpen.value = false
  }

  const openMenu = () => {
    isMenuOpen.value = true
  }

  // Close menu when route changes (matching your existing behavior)
  watch(() => route.path, closeMenu)

  // Handle clicks outside navigation (you'd call this from your component)
  const handleOutsideClick = (event: Event) => {
    if (!(event.target as HTMLElement).closest('nav')) {
      closeMenu()
    }
  }

  // Update directory items (if you need dynamic updates)
  const updateDirectoryItems = (items: DirectoryItem[]) => {
    directoryItems.value = items
    baseStore.setMessage('Navigation updated')
  }

  // Add a directory item
  const addDirectoryItem = (item: DirectoryItem) => {
    if (!directoryItems.value.find(existing => existing.to === item.to)) {
      directoryItems.value.push(item)
      baseStore.setMessage(`Added ${item.label} to directory`)
    }
  }

  // Remove a directory item
  const removeDirectoryItem = (itemTo: string) => {
    const index = directoryItems.value.findIndex(item => item.to === itemTo)
    if (index > -1) {
      const removed = directoryItems.value.splice(index, 1)[0]
      baseStore.setMessage(`Removed ${removed?.label ?? 'DIRECTORY'} from directory`)
    }
  }

  // Initialize navigation
  const initializeNavigation = () => {
    // Any initialization logic if needed
    baseStore.updateLastFetched()
  }

  // Clear navigation state (useful for logout)
  const clearNavigationData = () => {
    closeMenu()
    baseStore.clearCache()
  }

  return {
    // Base store functionality (minimal for navigation)
    isLoading: baseStore.isLoading,
    error: baseStore.error,
    message: baseStore.message,
    setError: baseStore.setError,
    setMessage: baseStore.setMessage,
    
    // Navigation state
    isMenuOpen,
    directoryItems,
    mainNavItems,
    
    // Computed
    currentRoute,
    authNavItem,
    directoryNavItem,
    directoryRoutes,
    allNavItems,
    isDirectoryRoute,
    
    // PWA TopNav helpers
    currentPageTitle,
    isMainNavigationRoute,
    currentPageIcon,
    currentPageSubtitle,
    
    // Actions
    toggleMenu,
    closeMenu,
    openMenu,
    handleOutsideClick,
    updateDirectoryItems,
    addDirectoryItem,
    removeDirectoryItem,
    initializeNavigation,
    clearNavigationData
  }
})