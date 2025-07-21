<template>
  <div
    class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-stone-200 group">
    <div class="flex items-center gap-4">
      <!-- Calendar Date - Left Side -->
      <div
        class="flex-shrink-0 bg-stone-100 rounded-xl p-3 border border-stone-200 group-hover:bg-stone-200 transition-colors">
        <div class="text-center min-w-[3rem]">
          <div class="text-xs font-semibold uppercase tracking-wide text-stone-500">{{ event.shortMonth }}</div>
          <div class="text-2xl font-bold text-stone-700">{{ event.dayNumber }}</div>
        </div>
      </div>

      <!-- Event Details - Center -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1 min-w-0">
            <h3 class="text-xl font-semibold text-stone-800 truncate">
              {{ event.title }}
            </h3>
            <p v-if="event.description" class="text-md text-stone-600 mt-1 line-clamp-2">
              {{ event.description }}
            </p>
          </div>

          <!-- Time & Day - Right Side -->
          <div class="flex-shrink-0 text-right">
            <div class="text-xl font-semibold text-stone-800">
              {{ event.time }}
            </div>
            <div class="text-md text-stone-500">
              {{ event.dayOfWeek }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Event {
  title: string
  description: string | null
  date: string
  formattedDate: string
  time: string
  shortMonth: string
  dayNumber: number
  dayOfWeek: string
  isUpcoming: boolean
}

defineProps<{ event: Event }>()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
