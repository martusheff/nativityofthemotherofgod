// composables/useFirebaseAuth.ts
import { ref, onMounted, computed } from 'vue'
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

export const useFirebaseAuth = () => {
  const auth = getAuth()
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref('')

  // Auth state
  const isAuthenticated = computed(() => !!user.value)
  const isEmailVerified = computed(() => user.value?.emailVerified ?? false)

  // Initialize auth state listener
  onMounted(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
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
    // State
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    isEmailVerified,
    
    // Methods
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
