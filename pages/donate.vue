<script setup lang="ts">
// Fetch donate page data (this would come from your CMS/API)
const { data: donateData } = await useAsyncData(() => 
  queryCollection('pages').path('/pages/donate').first()
)

useSeoMeta({
  title: 'Support Our Parish - Donations Coming Soon',
  description: 'Learn about upcoming donation opportunities to support our Orthodox parish community.',
})

// Email subscription for donation updates
const emailForm = ref({
  email: ''
})

const emailErrors = ref({})
const isSubmittingEmail = ref(false)
const emailSubmitted = ref(false)

const validateEmail = () => {
  const errors = {}
  
  if (!emailForm.value.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(emailForm.value.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  emailErrors.value = errors
  return Object.keys(errors).length === 0
}

const submitEmail = async () => {
  if (!validateEmail()) return
  
  isSubmittingEmail.value = true
  
  try {
    // Simulate email subscription
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Email subscription:', emailForm.value.email)
    emailSubmitted.value = true
    
    // Reset form
    emailForm.value.email = ''
  } catch (error) {
    console.error('Email submission error:', error)
  } finally {
    isSubmittingEmail.value = false
  }
}

// Ways to support in the meantime
const supportOptions = ref([
  {
    title: 'Share Our Mission',
    description: 'Help spread the word about our Orthodox community and invite others to join us in worship.',
    icon: '🤝',
    action: 'Share with Friends'
  },
  {
    title: 'Volunteer Your Time',
    description: 'Offer your skills and time to help with parish activities, maintenance, or community outreach.',
    icon: '⛪',
    action: 'Contact Fr. Nikita'
  },
  {
    title: 'Attend Services',
    description: 'Your presence and participation in our services strengthens our spiritual community.',
    icon: '🙏',
    action: 'View Schedule'
  },
  {
    title: 'Pray for Our Parish',
    description: 'Include our parish community in your daily prayers as we grow in faith together.',
    icon: '✨',
    action: 'Join Prayer List'
  }
])
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <section class="bg-stone-100 border-b border-stone-200 py-12">
      <div class="container mx-auto max-w-5xl px-4 text-center space-y-6">
        <h1 class="text-4xl md:text-6xl font-bold text-stone-800">Support Our Parish</h1>
        <svg class="w-28 h-auto mx-auto text-amber-600" viewBox="0 0 100 12" fill="none">
          <path d="M0 5 H50 C75 5 75 0 100 5" stroke="currentColor" stroke-width="2" />
        </svg>
        <p class="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto">
          Your generosity helps us build a stronger Orthodox community and continue our sacred mission.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="container mx-auto max-w-4xl px-4 py-16">
      <div class="text-center space-y-8">
        
        <!-- Status Update -->
        <div class="accentedBg border border-stone-200 rounded-3xl p-8 md:p-12 space-y-8">
          <div class="space-y-4">

            <h2 class="text-3xl md:text-4xl font-bold text-stone-800">
              Donations Coming Soon
            </h2>
            <p class="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
              We are currently processing our nonprofit status to ensure your donations are tax-deductible. 
              Once approved, we'll be ready to accept your generous support for our parish community.
            </p>
          </div>

          <!-- Progress Indicator -->
          <div class="space-y-4 p-4 shadow-sm rounded-3xl px-8 bg-white">
            <div class="flex justify-between items-center text-sm text-stone-600">
              <span>Application Submitted</span>
              <span>Approval Pending</span>
              <span>Ready to Accept Donations</span>
            </div>
            <div class="relative">
              <div class="w-full bg-stone-200 rounded-full h-2">
                <div class="bg-amber-500 h-2 rounded-full transition-all duration-500" style="width: 65%"></div>
              </div>
              <div class="absolute top-0 left-0 w-full flex justify-between">
                <div class="w-4 h-4 bg-amber-500 rounded-full transform -translate-y-1"></div>
                <div class="w-4 h-4 bg-amber-500 rounded-full transform -translate-y-1"></div>
                <div class="w-4 h-4 bg-stone-300 rounded-full transform -translate-y-1"></div>
              </div>
            </div>
          </div>
        </div>

        

          
     
      </div>
    </section>

    <!-- Ways to Support Now -->
    <section class="bg-stone-50 py-16">
      <div class="container mx-auto max-w-6xl px-4">
        <div class="text-center space-y-8">
          <div class="space-y-4">
            <h2 class="text-3xl md:text-4xl font-bold text-stone-800">
              Ways to Support Us Today
            </h2>
            <p class="text-lg text-stone-600 max-w-2xl mx-auto">
              While we prepare for monetary donations, there are many meaningful ways 
              you can support our parish community right now.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              v-for="option in supportOptions" 
              :key="option.title"
              class="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-stone-200 space-y-4"
            >
              <div class="text-center space-y-3">
                <div class="text-4xl">{{ option.icon }}</div>
                <h3 class="text-xl font-semibold text-stone-800">{{ option.title }}</h3>
                <p class="text-stone-600 leading-relaxed">{{ option.description }}</p>
              </div>
              
              <div class="pt-4">
                <UButton
                  class="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  :to="option.title === 'View Schedule' ? '/schedule' : option.title === 'Contact Fr. Nikita' ? '/contact' : '#'"
                >
                  {{ option.action }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Future Plans -->
    <section class="container mx-auto max-w-5xl px-4 py-16">
      <div class="bg-stone-100 rounded-3xl p-8 md:p-12 text-center space-y-6">
        <h2 class="text-3xl md:text-4xl font-bold text-stone-800">
          Our Vision for Giving
        </h2>
        <p class="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
          Once our nonprofit status is approved, your donations will support our sacred mission: 
          maintaining our beautiful worship space, supporting our priest and community programs, 
          and expanding our outreach to serve more families in our area. Every contribution, 
          no matter the size, helps us grow stronger as an Orthodox community.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <UButton
            class="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            href="/contact"
          >
            Questions About Giving?
          </UButton>
          <UButton
            class="bg-white border border-stone-300 hover:border-stone-400 text-stone-700 font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            href="/schedule"
          >
            Join Us for Service
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Custom focus styles for form elements */
input:focus {
  outline: none;
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}

/* Error state styling */
.border-red-500 {
  border-color: #ef4444;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>