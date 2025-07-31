<template>
  <div class="flex flex-col gap-6">
    <!-- Support Summary -->
     <div class="w-full flex flex-col gap-4 p-4 border rounded-3xl border-stone-200 shadow-sm">
            <p class="text-center italic text-lg leading-tight">In app donations are coming soon. In the meantime, we are accepting donations with the link below.</p>

    <NuxtLink to="https://donate.nativityofthemotherofgod.com/b/14A6oJakr1TD3Zs7DBeQM00"
      class="text-xl text-center w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 h-auto rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium">
      Donate
    </NuxtLink>
     </div>




    <!-- Quick Donation Options -->
    <!-- <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Make a Donation</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button
          v-for="amount in donationAmounts"
          :key="amount"
          @click="selectedAmount = amount"
          :class="[
            'p-4 rounded-xl border-2 transition-all text-center',
            selectedAmount === amount 
              ? 'border-amber-500 bg-amber-50 text-amber-700' 
              : 'border-stone-200 hover:border-amber-300'
          ]"
        >
          <p class="font-semibold">${{ amount }}</p>
        </button>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Custom Amount</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            v-model="customAmount"
            type="number"
            min="1"
            step="1"
            class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
            placeholder="Enter custom amount"
            @input="selectedAmount = null"
          />
        </div>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Donation Message (Optional)</label>
        <textarea
          v-model="donationMessage"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none"
          placeholder="Share why you're supporting us..."
        ></textarea>
      </div>

      <button
        @click="processDonation"
        :disabled="!getDonationAmount() || processing"
        class="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
      >
        {{ processing ? 'Processing...' : `Donate ${getDonationAmount() || '0'}` }}
      </button>

      <div v-if="donationError" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
        <p class="text-red-700 text-sm">{{ donationError }}</p>
      </div>

      <div v-if="donationSuccess" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
        <p class="text-green-700 text-sm">{{ donationSuccess }}</p>
      </div>
    </div> -->

    <!-- Donation History -->
    <!-- <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Donation History</h3>
      <div class="space-y-3">
        <div
          v-for="donation in donationHistory"
          :key="donation.id"
          class="flex items-center justify-between p-4 rounded-xl border border-stone-200"
        >
          <div class="flex items-center">
            <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
              <Icon name="heroicons:heart" class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p class="font-medium text-gray-900">${{ donation.amount }}</p>
              <p class="text-sm text-gray-600">{{ donation.date }}</p>
              <p v-if="donation.message" class="text-xs text-gray-500 mt-1 italic">"{{ donation.message }}"</p>
            </div>
          </div>
          <div class="text-right">
            <div class="flex items-center text-green-600 text-sm">
              <Icon name="heroicons:check-circle" class="w-4 h-4 mr-1" />
              <span>Completed</span>
            </div>
            <button class="text-xs text-gray-500 hover:text-gray-700 mt-1">
              View Receipt
            </button>
          </div>
        </div>
      </div>
    </div> -->

  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

// Donation state
const donationAmounts = [5, 10, 25, 50]
const selectedAmount = ref<number | null>(null)
const customAmount = ref<string>('')
const donationMessage = ref('')
const processing = ref(false)
const donationError = ref('')
const donationSuccess = ref('')

// Sample donation history
const donationHistory = ref([
  {
    id: 1,
    amount: 50,
    date: 'March 15, 2024',
    message: 'Keep up the great work!',
    status: 'completed'
  },
  {
    id: 2,
    amount: 25,
    date: 'February 10, 2024',
    message: '',
    status: 'completed'
  },
  {
    id: 3,
    amount: 50,
    date: 'January 5, 2024',
    message: 'Happy New Year! Supporting your mission.',
    status: 'completed'
  }
])

// Get the donation amount (either selected or custom)
const getDonationAmount = () => {
  if (selectedAmount.value) return selectedAmount.value
  if (customAmount.value) return parseInt(customAmount.value)
  return null
}

// Process donation
const processDonation = async () => {
  const amount = getDonationAmount()
  if (!amount || amount < 1) return

  processing.value = true
  donationError.value = ''
  donationSuccess.value = ''

  try {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // In real app, integrate with payment processor (Stripe, PayPal, etc.)
    console.log('Processing donation:', {
      amount,
      message: donationMessage.value
    })

    // Add to history
    donationHistory.value.unshift({
      id: Date.now(),
      amount,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      message: donationMessage.value,
      status: 'completed'
    })

    donationSuccess.value = `Thank you for your ${amount} donation! Your support means the world to us.`

    // Reset form
    selectedAmount.value = null
    customAmount.value = ''
    donationMessage.value = ''

    setTimeout(() => {
      donationSuccess.value = ''
    }, 5000)
  } catch (error) {
    donationError.value = 'Failed to process donation. Please try again.'
  } finally {
    processing.value = false
  }
}
</script>