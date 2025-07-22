import { defineNuxtRouteMiddleware } from '#imports'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'
import { navigateTo } from '#app'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware on server side
  if (process.server) return

  const { isAuthenticated, loading } = useFirebaseAuth()

  const authStateResolved = await new Promise<boolean>((resolve) => {
    if (!loading.value) {
      resolve(true)
      return
    }

    const timeout = setTimeout(() => {
      resolve(false)
    }, 3000)

    const unwatchLoading = watch(loading, (newLoading) => {
      if (!newLoading) {
        clearTimeout(timeout)
        unwatchLoading()
        resolve(true)
      }
    })
  })

  if (!authStateResolved) {
    console.error('Auth state failed to resolve.')
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login', { replace: true })
  }
})