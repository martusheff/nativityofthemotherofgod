import { defineNuxtRouteMiddleware } from '#imports'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'
import { navigateTo } from '#app'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware on server side
  if (process.server) return

  const { isAuthenticated, loading } = useFirebaseAuth()

  console.log(`Auth middleware: Checking for ${to.path}, from ${from?.path || 'direct'}`)
  console.log(`Initial state - loading: ${loading.value}, isAuthenticated: ${isAuthenticated.value}`)

  // Wait for auth state to resolve with a more reasonable timeout
  const authStateResolved = await new Promise<boolean>((resolve) => {
    // If already loaded, resolve immediately
    if (!loading.value) {
      console.log('Auth already loaded, proceeding')
      resolve(true)
      return
    }

    const timeout = setTimeout(() => {
      console.warn('Auth state timeout after 3 seconds')
      resolve(false)
    }, 3000) // Reduced to 3 seconds

    // Watch for loading to become false
    const unwatchLoading = watch(loading, (newLoading) => {
      if (!newLoading) {
        console.log(`Auth state resolved: isAuthenticated=${isAuthenticated.value}`)
        clearTimeout(timeout)
        unwatchLoading() // Clean up watcher
        resolve(true)
      }
    })
  })

  if (!authStateResolved) {
    console.error('Auth state failed to resolve, allowing navigation but user might see flash')
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated.value) {
    console.log(`Redirecting to /login from ${to.path} (unauthenticated)`)
    return navigateTo('/login', { replace: true })
  }

  console.log(`Allowing navigation to ${to.path} (authenticated as ${useFirebaseAuth().user.value?.email})`)
})