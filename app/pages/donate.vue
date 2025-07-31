<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Support Our Parish',
  description: 'Make a secure online donation to help our Orthodox parish grow.',
})

// Fetch dynamic hero content if needed
const { data: donatePage } = await useAsyncData(() =>
  queryCollection('pages').path('/pages/donate').first()
)

// State
const presetAmounts = [25, 50, 100, 250, 500]
const amount = ref<number | null>(50)
const processing = ref(false)
const errorMessage = ref('')
const showCustom = ref(false)

const isCustom = computed(() => showCustom.value)

const selectPreset = (preset: number) => {
  amount.value = preset
  showCustom.value = false
}

const selectCustom = () => {
  showCustom.value = true
  amount.value = null
  nextTick(() => {
    document.getElementById('custom-input')?.focus()
  })
}

const onCustomInput = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value)
  amount.value = isNaN(val) ? null : val
}

const blockInvalidKeys = (e: KeyboardEvent) => {
  if (['e', 'E', '+', '-'].includes(e.key)) {
    e.preventDefault()
  }
}

const donate = async () => {
  if (!amount.value || processing.value) return

  processing.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch('/api/stripe/create-donation-session', {
      method: 'POST',
      body: { amount: amount.value * 100 },
    }) as { url: string }

    window.location.href = response.url

  } catch {
    errorMessage.value = 'Something went wrong. Please try again.'
    processing.value = false
  }
}
</script>

<template>
  <main class="min-h-screen flex flex-col">
    <!-- Hero -->
    <HeroLowImpact :title="donatePage?.title" :subtitle="donatePage?.subTitle" />

    <!-- Donation section -->
    <section class="flex justify-center px-4 py-20">
      <div class="w-full max-w-md space-y-8">

        <!-- Amount buttons -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            v-for="preset in presetAmounts"
            :key="preset"
            @click="selectPreset(preset)"
            :class="[
              'w-full py-4 rounded-xl text-lg font-medium border transition',
              amount === preset && !isCustom
                ? 'bg-amber-500 text-white border-amber-500 shadow'
                : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400 '
            ]"
          >
            ${{ preset }}
          </button>

          <button
            @click="selectCustom"
            :class="[
              'w-full py-4 rounded-xl text-lg font-medium border transition',
              isCustom
                ? 'bg-amber-500 text-white border-amber-500 shadow'
                : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
            ]"
          >
            Custom
          </button>
        </div>

        <!-- Animated custom input -->
        <transition name="slide-fade">
          <div v-if="isCustom" class="overflow-hidden">
            <input
              id="custom-input"
              type="number"
              min="1"
              step="0.01"
              placeholder="Enter amount"
              @keydown="blockInvalidKeys"
              @input="onCustomInput"
              class="no-spinner w-full py-2 px-4 mt-4 border border-stone-200 rounded-xl text-center bg-stone-50 focus:border-amber-400 focus:bg-white"
            />
          </div>
        </transition>

        <!-- Error -->
        <p v-if="errorMessage" class="text-red-600 text-center text-sm">
          {{ errorMessage }}
        </p>

        <!-- Donate button -->
        <button
          @click="donate"
          :disabled="!amount || processing"
          :class="[
            'w-full py-4 rounded-full text-lg font-semibold transition',
            !amount || processing
              ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
              : 'bg-amber-500 text-white hover:bg-amber-600 shadow hover:shadow-lg'
          ]"
        >
          <span v-if="processing" class="flex items-center justify-center gap-2">
            <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Redirecting...
          </span>
          <span v-else>Donate ${{ amount || '' }}</span>
        </button>

        <!-- Secure badge -->
        <p class="text-center text-xs text-stone-500 font-light flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure payment by Stripe
        </p>

      </div>
    </section>
  </main>
</template>

<style scoped>
/* Hide number input spinners */
input.no-spinner::-webkit-outer-spin-button,
input.no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input.no-spinner {
  -moz-appearance: textfield;
}

/* Animate slide-fade */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  max-height: 0;
  opacity: 0;
}
.slide-fade-enter-to {
  max-height: 100px;
  opacity: 1;
}
.slide-fade-leave-from {
  max-height: 100px;
  opacity: 1;
}
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
