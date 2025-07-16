<script setup lang="ts">
import { ref } from 'vue'

// Access runtime config
const config = useRuntimeConfig()

// Fetch contact page data (this would come from your CMS/API)
const { data: contactData } = await useAsyncData(() =>
  queryCollection('pages').path('/pages/contact').first()
)

useSeoMeta({
  title: 'Contact Us - Orthodox Parish',
  description: 'Get in touch with our Orthodox parish for services, inquiries, or spiritual guidance.',
})

// Form data
const form = ref({
  access_key: config.public.web3FormsAccessKey, // Use runtime config
  subject: 'New Contact Submission from nativityofthemotherofgod.com',
  name: '',
  email: '',
  phone: '',
  message: '',
  'cf-turnstile-response': ''
})

const onTurnstileSuccess = (token: string) => {
  form.value['cf-turnstile-response'] = token
}

// Form validation
const errors = ref({})
const isSubmitting = ref(false)
const isSubmitted = ref(false)

const validateForm = () => {
  const newErrors = {}

  if (!form.value.name.trim()) {
    newErrors.name = 'Name is required'
  }

  if (!form.value.email.trim()) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    newErrors.email = 'Please enter a valid email address'
  }

  if (!form.value.subject.trim()) {
    newErrors.subject = 'Subject is required'
  }

  if (!form.value.message.trim()) {
    newErrors.message = 'Message is required'
  }

  // Check for Turnstile token
  if (!form.value['cf-turnstile-response']) {
    newErrors.turnstile = 'Please complete the CAPTCHA verification'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const submitForm = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const response = await $fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: form.value,
    })

    isSubmitted.value = true

    // Reset form
    form.value = {
      access_key: config.public.web3FormsAccessKey, // Use runtime config
      subject: 'New Contact Submission from nativityofthemotherofgod.com',
      name: '',
      email: '',
      phone: '',
      message: '',
      'cf-turnstile-response': ''
    }
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetSuccessMessage = () => {
  isSubmitted.value = false
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <section class="bg-stone-100 border-b border-stone-200 py-12">
      <div class="container mx-auto max-w-5xl px-4 text-center space-y-6">
        <h1 class="text-4xl md:text-6xl font-bold text-stone-800">Contact Us</h1>
        <svg class="w-28 h-auto mx-auto text-amber-600" viewBox="0 0 100 12" fill="none">
          <path d="M0 5 H50 C75 5 75 0 100 5" stroke="currentColor" stroke-width="2" />
        </svg>
        <p class="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto">
          We're here to help with your spiritual journey and answer any questions you may have.
        </p>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="container mx-auto max-w-4xl px-4 py-12">
      <div class="grid grid-cols-1 gap-12">

        <!-- Contact Form -->
        <div class="space-y-8">
          <div class="space-y-4">
            <h2 class="text-3xl md:text-4xl font-bold text-stone-800 text-center">Send us a Message</h2>
            <p class="text-lg text-stone-600 text-center">
              Fill out the form below and Fr. Nikita will get back to you as soon as possible.
            </p>
          </div>

          <!-- Success Message -->
          <div v-if="isSubmitted" class="bg-green-50 accentedBg rounded-3xl p-12">
            <div class="flex justify-center items-center gap-3 p-12">
              <div class="p-12">
                <h3 class="text-2xl text-center pt-8">Message Sent</h3>
                <p class="text-lg text-center pb-8">Thank you for contacting us. We'll respond when we receive your message.</p>
              </div>
            </div>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="submitForm" class="space-y-6">
            <!-- Name and Email Row -->
            <div class="grid grid-cols-1 gap-4">
              <div class="space-y-2">
                <UInput v-model="form.name" type="text" placeholder="Your full name"
                  class="w-full border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  :class="{ 'border-red-500': errors.name }" />
                <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
              </div>
              <div class="space-y-2">
                <UInput v-model="form.email" type="email" placeholder="your@email.com"
                  class="w-full border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  :class="{ 'border-red-500': errors.email }" />
                <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
              </div>
            </div>

            <!-- Phone and Inquiry Type Row -->
            <div class="grid grid-cols-1 gap-4">
              <div class="space-y-2">
                <UInput v-model="form.phone" type="tel" placeholder="(555) 123-4567 - (optional)"
                  class="w-full border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
              </div>
            </div>

            <!-- Message -->
            <div class="space-y-2">
              <textarea v-model="form.message" placeholder="Please share your questions or how we can help you..."
                rows="6"
                class="w-full border border-stone-300 rounded-3xl focus:outline-0 focus:ring-none focus:ring-0 focus:border-transparent resize-none"
                :class="{ 'border-red-500': errors.message }"></textarea>
              <p v-if="errors.message" class="text-red-500 text-sm">{{ errors.message }}</p>
            </div>

            <!-- Turnstile Widget -->
            <div class="space-y-2">
              <NuxtTurnstile ref="turnstile" @success="onTurnstileSuccess" class="mx-auto" />
              <p v-if="errors.turnstile" class="text-red-500 text-sm text-center">{{ errors.turnstile }}</p>
            </div>

            <!-- Submit Button -->
            <button type="submit" :disabled="isSubmitting"
              class="w-full text-center text-lg font-medium bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 block">
              <span v-if="isSubmitting">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Sending Message...
              </span>
              <span v-else>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Custom focus styles for form elements */
input:focus,
select:focus,
textarea:focus {
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