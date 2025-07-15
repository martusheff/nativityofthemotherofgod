<template>
  <div class="w-full bg-gradient-to-br from-stone-50 to-stone-100 py-16">
    <div class="mx-auto md:px-8 md:max-w-7xl">
      <!-- Section Header -->
      <div v-if="!props.expanded" class="flex flex-col items-center text-center gap-6 pb-12">
        <h2 class="text-4xl md:text-5xl text-stone-800 font-bold leading-tight tracking-tight">
          Our Journey
        </h2>
        <svg class="w-32 h-auto text-amber-600" viewBox="0 0 100 10" fill="none">
          <path d="M0 5 H50 C75 5 75 0 100 5" stroke="currentColor" stroke-width="2" />
        </svg>
        <p class="text-lg md:text-2xl text-stone-600 leading-relaxed max-w-3xl px-4">
          Discover the path that led to the establishment of our Orthodox Old Rite Mission under ROCOR.
        </p>
      </div>

      <!-- Hero Section for Expanded View -->
      <section v-if="props.expanded" class="bg-stone-100 border-b border-stone-200 py-12 -mx-4 md:mx-0 mb-12">
        <div class="container mx-auto max-w-5xl px-4 text-center space-y-6">
          <h1 class="text-4xl md:text-6xl font-bold text-stone-800">Our Journey</h1>
          <svg class="w-28 h-auto mx-auto text-amber-600" viewBox="0 0 100 12" fill="none">
            <path d="M0 5 H50 C75 5 75 0 100 5" stroke="currentColor" stroke-width="2" />
          </svg>
          <p class="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto">
            Discover the path that led to the establishment of our Orthodox Old Rite Mission under ROCOR.
          </p>
        </div>
      </section>

      <!-- Timeline Container -->
      <div class="relative max-w-7xl mx-auto px-4 md:px-0">
        <!-- Continuous Central Line -->
        <div class="absolute left-7 md:left-1/2 md:transform md:-translate-x-1/2 w-1 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full shadow-sm top-0 bottom-0"></div>
        
        <!-- Timeline Items -->
        <div class="space-y-8 md:space-y-12">
          <div
            v-for="(milestone, index) in milestones"
            :key="index"
            class="relative flex items-center"
          >
            <!-- Mobile Layout (All on right) -->
            <div class="md:hidden flex items-center w-full">
              <!-- Line and Dot -->
              <div class="flex-shrink-0 flex flex-col items-center mr-6 relative z-10">
                <div class="w-6 h-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg border-4 border-white"></div>
              </div>
              
              <!-- Content -->
              <div class="flex-1">
                <div class="group bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 rounded-3xl overflow-hidden border border-stone-200">
                  <div class="p-6 space-y-2">
                    <div class="flex items-center gap-3">
                      <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <p class="text-amber-600 italic text-lg font-semibold">{{ milestone.formattedDate }}</p>
                    </div>
                    <h3 class="text-2xl text-stone-800 font-bold leading-tight group-hover:text-amber-700 transition-colors duration-300">
                      {{ milestone.title }}
                    </h3>
                    <p class="text-stone-600 text-lg leading-tight" :class="{ 'line-clamp-3': !props.expanded }">
                      {{ milestone.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Desktop Layout (Alternating) -->
            <div class="hidden md:flex items-center w-full">
              <!-- Left Side (Even indices) -->
              <div 
                v-if="index % 2 === 0" 
                class="flex items-center w-full"
              >
                <!-- Content -->
                <div class="flex-1 pr-8">
                  <div class="group bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 rounded-3xl overflow-hidden border border-stone-200">
                    <div class="p-6 space-y-2">
                      <div class="flex items-center justify-end gap-3">
                        <p class="text-amber-600 italic text-lg font-semibold">{{ milestone.formattedDate }}</p>
                        <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
                      </div>
                      <h3 class="text-2xl text-stone-800 font-bold leading-tight text-right group-hover:text-amber-700 transition-colors duration-300">
                        {{ milestone.title }}
                      </h3>
                      <p class="text-stone-600 text-lg leading-tight text-right" :class="{ 'line-clamp-3': !props.expanded }">
                        {{ milestone.description }}
                      </p>
                    </div>
                  </div>
                </div>
                
                <!-- Center Line and Dot -->
                <div class="flex-shrink-0 flex flex-col items-center relative z-10">
                  <div class="w-6 h-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg border-4 border-white"></div>
                </div>
                
                <!-- Right Side Spacer -->
                <div class="flex-1 pl-8"></div>
              </div>

              <!-- Right Side (Odd indices) -->
              <div 
                v-else 
                class="flex items-center w-full"
              >
                <!-- Left Side Spacer -->
                <div class="flex-1 pr-8"></div>
                
                <!-- Center Line and Dot -->
                <div class="flex-shrink-0 flex flex-col items-center relative z-10">
                  <div class="w-6 h-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg border-4 border-white"></div>
                </div>
                
                <!-- Content -->
                <div class="flex-1 pl-8">
                  <div class="group bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 rounded-3xl overflow-hidden border border-stone-200">
                    <div class="p-6 space-y-2">
                      <div class="flex items-center gap-3">
                        <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <p class="text-amber-600 italic text-lg font-semibold">{{ milestone.formattedDate }}</p>
                      </div>
                      <h3 class="text-2xl text-stone-800 font-bold leading-tight group-hover:text-amber-700 transition-colors duration-300">
                        {{ milestone.title }}
                      </h3>
                      <p class="text-stone-600 text-lg leading-tight" :class="{ 'line-clamp-3': !props.expanded }">
                        {{ milestone.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- View Full Timeline Button -->
        <div v-if="showViewMoreButton" class="flex justify-center mt-12">
          <a
            href="/timeline"
            class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-xl tracking-wide group flex items-center gap-2"
          >
            <span>View Full Timeline</span>
            <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Props
interface Props {
  expanded?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  expanded: false
});

const MAX_TIMELINE_ITEMS = 4;

// Fetch timeline from content API
const { data: timelineData } = await useAsyncData(() =>
  queryCollection('timeline').all()
);

// Format + sort milestones
const allMilestones = computed(() => {
  return (timelineData.value || [])
    .map(item => ({
      ...item,
      formattedDate: new Date(item.date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const milestones = computed(() => {
  return props.expanded
    ? allMilestones.value
    : allMilestones.value.slice(0, MAX_TIMELINE_ITEMS);
});

const showViewMoreButton = computed(() => {
  return !props.expanded && allMilestones.value.length > MAX_TIMELINE_ITEMS;
});
</script>

<style scoped>
/* Add any timeline-specific styles if needed */
</style>