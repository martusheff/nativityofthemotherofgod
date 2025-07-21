<template>
  <div>
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
            <Icon name="heroicons:calendar-days" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Member Since</p>
            <p class="font-semibold text-gray-900">{{ formatDate(user?.metadata?.creationTime) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
            <Icon name="heroicons:bell" class="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Notifications</p>
            <p class="font-semibold text-gray-900">3 Active</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mr-3">
            <Icon name="heroicons:heart" class="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Support</p>
            <p class="font-semibold text-gray-900">$125</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between py-3 border-b border-stone-100 last:border-b-0">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Icon name="heroicons:check" class="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Email verified</p>
              <p class="text-xs text-gray-500">{{ formatDate(user?.metadata?.creationTime) }}</p>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between py-3 border-b border-stone-100 last:border-b-0">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Icon name="heroicons:user-plus" class="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Account created</p>
              <p class="text-xs text-gray-500">{{ formatDate(user?.metadata?.creationTime) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Account Security -->
    <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 rounded-xl border border-stone-200">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
              <Icon name="heroicons:shield-check" class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Email Verification</h4>
              <p class="text-sm text-gray-600">Your email address is verified</p>
            </div>
          </div>
          <div class="text-green-600">
            <Icon name="heroicons:check-circle" class="w-5 h-5" />
          </div>
        </div>

        <div class="flex items-center justify-between p-4 rounded-xl border border-stone-200">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
              <Icon name="heroicons:key" class="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Password</h4>
              <p class="text-sm text-gray-600">Last updated {{ formatDate(user?.metadata?.lastSignInTime) }}</p>
            </div>
          </div>
          <button class="text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors">
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  user: any
}

defineProps<Props>()

// Utility functions
const formatDate = (dateString?: string) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>