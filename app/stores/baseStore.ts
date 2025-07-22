import { ref, computed } from 'vue'

export interface BaseStoreOptions {
  cacheDuration?: number
  errorTimeout?: number
  messageTimeout?: number
}

export function useBaseStore(options: BaseStoreOptions = {}) {
  const {
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
    errorTimeout = 5000,
    messageTimeout = 3000
  } = options

  // Common state
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const message = ref<string | null>(null)
  const lastFetched = ref<number | null>(null)

  // Common getters
  const isCacheStale = computed(() => {
    if (!lastFetched.value) return true
    return Date.now() - lastFetched.value > cacheDuration
  })

  const hasError = computed(() => !!error.value)
  const hasMessage = computed(() => !!message.value)

  // Common actions
  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
    if (errorMessage && errorTimeout > 0) {
      setTimeout(() => {
        error.value = null
      }, errorTimeout)
    }
  }

  const setMessage = (messageText: string | null) => {
    message.value = messageText
    if (messageText && messageTimeout > 0) {
      setTimeout(() => {
        message.value = null
      }, messageTimeout)
    }
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const updateLastFetched = () => {
    lastFetched.value = Date.now()
  }

  const clearCache = () => {
    lastFetched.value = null
  }

  const executeAsync = async <T>(
    operation: () => Promise<T>,
    options: {
      loadingState?: boolean
      clearError?: boolean
      successMessage?: string
      errorMessage?: string
    } = {}
  ): Promise<T | null> => {
    const {
      loadingState = true,
      clearError = true,
      successMessage,
      errorMessage
    } = options

    if (clearError) error.value = null
    if (loadingState) isLoading.value = true

    try {
      const result = await operation()
      updateLastFetched()
      if (successMessage) setMessage(successMessage)
      return result
    } catch (err) {
      console.error('Store operation failed:', err)
      const finalErrorMessage = errorMessage || (err instanceof Error ? err.message : 'Operation failed')
      setError(finalErrorMessage)
      return null
    } finally {
      if (loadingState) isLoading.value = false
    }
  }

  return {
    // State
    isLoading,
    error,
    message,
    lastFetched,
    // Getters
    isCacheStale,
    hasError,
    hasMessage,
    // Actions
    setError,
    setMessage,
    setLoading,
    updateLastFetched,
    clearCache,
    executeAsync
  }
}
