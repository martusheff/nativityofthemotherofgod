<template>
  <div class="w-full ">
    <div class="flex flex-col items-center text-center gap-6 py-16">
      <h2 class="text-4xl md:text-5xl text-stone-800 font-bold leading-tight tracking-tight">
        Our Journey
      </h2>
      <svg class="w-32 h-auto text-amber-600" viewBox="0 0 100 10" fill="none">
        <path d="M0 5 H50 C75 5 75 0 100 5" stroke="currentColor" stroke-width="2" />
      </svg>
      <p class="text-lg md:text-2xl text-stone-600 leading-relaxed max-w-3xl px-4">
        Discover the path that led to the establishment of our Orthodox Old Rite
        Mission under ROCOR.
      </p>
    </div>

    <!-- Timeline Container -->
    <div class="relative max-w-7xl mx-auto px-4 md:px-8 md:pb-16">
      <!-- Timeline Items Container -->
      <div class="relative md:py-12 md:pt-16" :class="expanded && 'py-12'">
        <!-- Central Line - only extends through timeline items -->
        <div
          class="absolute left-2.5 md:left-1/2 md:transform md:-translate-x-1/2 w-1 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full shadow-sm top-0 bottom-0">
        </div>

        <!-- Timeline Items -->
        <div class="space-y-8 md:space-y-2 relative z-10">
          <div v-for="(milestone, index) in milestones" :key="index" class="relative flex items-center">
            <!-- Mobile: All Right -->
            <div class="md:hidden flex items-center w-full">
              <!-- Dot -->
              <div class="flex-shrink-0 flex flex-col items-center mr-6 relative z-10">
                <div
                  class="w-6 h-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg border-4 border-white">
                </div>
              </div>
              <!-- Card -->
              <div class="flex-1">
                <TimelineCard :milestone="milestone" align="left" />
              </div>
            </div>

            <!-- Desktop: Alternating -->
            <div class="hidden md:flex items-center w-full">
              <!-- Left Side (Even) -->
              <div v-if="index % 2 === 0" class="flex items-center w-full">
                <div class="flex-1 pr-8">
                  <TimelineCard :milestone="milestone" align="right" />
                </div>
                <div class="flex-shrink-0 flex flex-col items-center relative z-10">
                  <div
                    class="w-6 h-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg border-4 border-white">
                  </div>
                </div>
                <div class="flex-1 pl-8"></div>
              </div>
              <!-- Right Side (Odd) -->
              <div v-else class="flex items-center w-full">
                <div class="flex-1 pr-8"></div>
                <div class="flex-shrink-0 flex flex-col items-center relative z-10">
                  <div
                    class="w-6 h-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg border-4 border-white">
                  </div>
                </div>
                <div class="flex-1 pl-8">
                  <TimelineCard :milestone="milestone" align="left" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- View More Button -->
      <div v-if="showViewMoreButton" class="flex justify-center mt-12">
        <a href="/timeline"
          class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-xl tracking-wide group flex items-center gap-2">
          <span>View Full Timeline</span>
          <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Props
interface Props {
  expanded?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  expanded: false
});

// Get timeline data
const { data: timelineData } = await useAsyncData(() =>
  queryCollection('timeline').all()
);

// Format + sort
const milestones = computed(() => {
  const sorted = (timelineData.value || [])
    .map(item => ({
      ...item,
      formattedDate: new Date(item.date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // If not expanded, limit to 4 items
  return props.expanded ? sorted : sorted.slice(0, 4);
});

const showViewMoreButton = computed(() => !props.expanded && milestones.value.length >= 4);
</script>