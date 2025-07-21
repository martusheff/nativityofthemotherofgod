// ~/middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'

export default defineNuxtRouteMiddleware(async () => {
  const { user, loading } = useFirebaseAuth()

  // Wait a moment if still loading
  if (loading.value) {
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})
