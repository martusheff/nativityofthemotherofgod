<script setup lang="ts">
import { ref } from 'vue'

// Define error types
interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  turnstile?: string;
  general?: string;
  [key: string]: string | undefined;
}

// Access runtime config
const config = useRuntimeConfig()

// Fetch contact page data (this would come from your CMS/API)
const { data: contactPage } = await useAsyncData(() =>
  queryCollection('pages').path('/pages/contact').first()
)

useSeoMeta({
  title: 'Contact Us - Orthodox Parish',
  description: 'Get in touch with our Orthodox parish for services, inquiries, or spiritual guidance.',
})

// Form data
const form = ref({
  access_key: config.public.web3FormsAccessKey,
  subject: 'New Contact Submission from nmog.org',
  name: '',
  email: '',
  phone: '',
  message: '',
  'cf-turnstile-response': ''
})

// Form validation
const errors = ref<FormErrors>({})
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const turnstile = ref<any>(null) // Using any here because NuxtTurnstile type may not be available
const turnstileLoaded = ref(false)

const validateForm = (): boolean => {
  const newErrors: FormErrors = {}

  if (!form.value.name.trim()) {
    newErrors.name = 'Name is required'
  }

  if (!form.value.email.trim()) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    newErrors.email = 'Please enter a valid email address'
  }

  if (!form.value.message.trim()) {
    newErrors.message = 'Message is required'
  }

  // Check for Turnstile token only if the widget is loaded
  if (turnstileLoaded.value && !form.value['cf-turnstile-response']) {
    newErrors.turnstile = 'Please complete the CAPTCHA verification'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const onTurnstileSuccess = (token: string): void => {
  form.value['cf-turnstile-response'] = token
  if (errors.value.turnstile) {
    delete errors.value.turnstile
  }
}

const onTurnstileError = (error: any): void => {
  form.value['cf-turnstile-response'] = ''
  errors.value.turnstile = 'CAPTCHA verification failed. Please try again.'
}

const onTurnstileExpired = (): void => {
  form.value['cf-turnstile-response'] = ''
  errors.value.turnstile = 'CAPTCHA verification expired. Please complete it again.'
}

const onTurnstileLoad = (): void => {
  turnstileLoaded.value = true
}

const resetTurnstile = (): void => {
  if (turnstile.value) {
    try {
      turnstile.value.reset()
      form.value['cf-turnstile-response'] = ''
    } catch (error) {
      console.error('Error resetting Turnstile:', error)
    }
  }
}

const submitForm = async (): Promise<void> => {
  if (!validateForm()) {
    return
  }

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
      ...form.value,
      name: '',
      email: '',
      phone: '',
      message: '',
      'cf-turnstile-response': ''
    }

    // Reset turnstile
    resetTurnstile()

  } catch (error: unknown) {
    console.error('Form submission error:', error)

    // Reset turnstile on error
    resetTurnstile()

    // Type-safe error handling
    if (error instanceof Error && error.message.includes('captcha')) {
      errors.value.turnstile = 'CAPTCHA verification failed. Please try again.'
    } else {
      errors.value.general = 'Failed to send message. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}

</script>

<template>
  <div class="min-h-screen">
    <HeroLowImpact :title="contactPage?.title" :subtitle="contactPage?.subTitle" />

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
                <p class="text-lg text-center pb-8">Thank you for contacting us. We'll respond when we receive your
                  message.</p>


              </div>
            </div>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="submitForm" class="space-y-6">
            <!-- General Error Message -->
            <div v-if="errors.general" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-red-600 text-sm">{{ errors.general }}</p>
            </div>

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
                class="w-full border border-stone-300 rounded-3xl focus:outline-0 focus:ring-none focus:ring-0  resize-none"
                :class="{ 'border-red-500': errors.message }"></textarea>
              <p v-if="errors.message" class="text-red-500 text-sm">{{ errors.message }}</p>
            </div>

            <!-- Turnstile Widget -->
            <div class="space-y-2 w-full mx-auto">
              <NuxtTurnstile ref="turnstile" @success="onTurnstileSuccess" @error="onTurnstileError"
                @expired="onTurnstileExpired" @load="onTurnstileLoad" class="mx-auto" />
              <p v-if="errors.turnstile" class="text-red-500 text-sm text-center">{{ errors.turnstile }}</p>
            </div>

            <!-- Submit Button -->
            <button type="submit" :disabled="isSubmitting"
              class="w-full text-center text-lg font-medium bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 block">

              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>