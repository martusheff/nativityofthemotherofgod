import { ref, computed, readonly } from 'vue'
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  sendEmailVerification,
  type User
} from 'firebase/auth'
import { auth } from '~/utils/firebase'

// Global state - shared across all composable instances
const user = ref<User | null>(null)
const loading = ref(true)
const error = ref('')
let authStateInitialized = false

// Initialize auth state listener once globally
const initializeAuth = () => {
  if (authStateInitialized) return
  authStateInitialized = true

  onAuthStateChanged(auth, (firebaseUser) => {
    console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out')
    user.value = firebaseUser
    loading.value = false
  }, (error) => {
    console.error('Auth state error:', error)
    loading.value = false
  })
}

export const useFirebaseAuth = () => {
  // Initialize auth listener if not already done
  initializeAuth()

  // Auth state
  const isAuthenticated = computed(() => !!user.value)
  const isEmailVerified = computed(() => user.value?.emailVerified ?? false)

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      error.value = ''
      const provider = new GoogleAuthProvider()
      // Add these scopes for better user info
      provider.addScope('profile')
      provider.addScope('email')
      
      const userCredential = await signInWithPopup(auth, provider)
      console.log('Google sign-in successful:', userCredential.user.email)
      return userCredential.user
    } catch (err: any) {
      console.error('Google sign-in error:', err)
      error.value = err.message
      throw err
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      error.value = ''
      await firebaseSignOut(auth)
      console.log('Sign out successful')
    } catch (err: any) {
      console.error('Sign out error:', err)
      error.value = err.message
      throw err
    }
  }

  // Update user profile
  const updateProfile = async (updates: { displayName?: string; photoURL?: string }) => {
    if (!user.value) throw new Error('No user logged in')
    
    try {
      error.value = ''
      await firebaseUpdateProfile(user.value, updates)
      console.log('Profile updated successfully')
    } catch (err: any) {
      console.error('Profile update error:', err)
      error.value = err.message
      throw err
    }
  }

  // Send email verification
  const sendVerificationEmail = async () => {
    if (!user.value) throw new Error('No user logged in')
    
    try {
      error.value = ''
      await sendEmailVerification(user.value)
      console.log('Verification email sent')
    } catch (err: any) {
      console.error('Send verification error:', err)
      error.value = err.message
      throw err
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    isEmailVerified,
    signInWithGoogle,
    signOut,
    updateProfile,
    sendVerificationEmail
  }
}