import { ref, onMounted, computed, readonly } from 'vue'
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
  type User
} from 'firebase/auth'
import { auth } from '~/utils/firebase'

export const useFirebaseAuth = () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref('')

  // Auth state
  const isAuthenticated = computed(() => !!user.value)
  const isEmailVerified = computed(() => user.value?.emailVerified ?? false)

  // Initialize auth state listener with timeout
  onMounted(() => {
    const timeout = setTimeout(() => {
      if (loading.value) {
        loading.value = false
        console.warn('Auth loading timed out')
      }
    }, 5000) // 5 seconds

    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
      clearTimeout(timeout)
    })
  })

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      error.value = ''
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      error.value = ''
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      if (displayName) {
        await firebaseUpdateProfile(userCredential.user, { displayName })
      }
      
      return userCredential.user
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      error.value = ''
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      return userCredential.user
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      error.value = ''
      await firebaseSignOut(auth)
    } catch (err: any) {
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
    } catch (err: any) {
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
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Send password reset email
  const resetPassword = async (email: string) => {
    try {
      error.value = ''
      await sendPasswordResetEmail(auth, email)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Delete user account
  const deleteAccount = async () => {
    if (!user.value) throw new Error('No user logged in')
    
    try {
      error.value = ''
      await deleteUser(user.value)
    } catch (err: any) {
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
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
    sendVerificationEmail,
    resetPassword,
    deleteAccount
  }
}