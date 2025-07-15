<template>
  
  <div class="w-full bg-gradient-to-br py-8">
    <div class="mx-auto  md:px-8 md:max-w-7xl">
      <!-- Section Header -->
      <div class="flex flex-col items-center text-center gap-6 pb-12">
        <h2 class="text-4xl md:text-5xl text-stone-800 font-bold leading-tight tracking-tight">
          Our Journey
        </h2>
        <svg class="w-32 h-auto text-amber-600" viewBox="0 0 100 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 5 H50 C75 5 75 0 100 5" stroke="currentColor" stroke-width="2" />
        </svg>
        <p class="text-lg md:text-2xl text-stone-600 leading-relaxed max-w-3xl px-4">
          Discover the path that led to the establishment of our Orthodox Old Rite Mission under ROCOR
        </p>
      </div>

      <!-- Timeline Container -->
      <div class="relative max-w-7xl mx-auto my-2">
        <!-- Central Line (Desktop) / Left Line (Mobile) -->
        <div 
          class="absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 w-1 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full shadow-sm"
          :style="{ height: `${60 + (milestones.length - 1) * 180 + 70}px` }"
        ></div>

        <!-- Timeline Items Container -->
        <div 
          class=""
          :style="{ minHeight: `${60 + (milestones.length - 1) * 180 + 120}px` }"
        >
          <!-- Left Side Cards (Desktop Only) -->
          <div class="hidden md:block absolute top-0 left-0 w-[calc(50%-2rem)]">
            <div 
              v-for="(milestone, index) in milestones" 
              :key="`left-${index}`"
              v-show="index % 2 === 0"
              class="group absolute w-full"
              :style="{ top: `${60 + index * 180}px`, transform: 'translateY(-50%)' }"
            >
              <div class="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 rounded-3xl overflow-hidden border border-slate-100">
                <div class="p-6 space-y-2">
                  <!-- Date -->
                  <div class="flex items-center justify-end gap-3">
                    <p class="text-amber-600 italic text-lg font-semibold">{{ milestone.date }}</p>
                    <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
                  </div>
                  
                  <!-- Title -->
                  <h3 class="text-2xl text-stone-800 font-bold leading-tight group-hover:text-amber-700 transition-colors duration-300 text-right">
                    {{ milestone.title }}
                  </h3>
                  
                  <!-- Description -->
                  <p class="text-stone-600 text-lg leading-tight text-right line-clamp-2 md:line-clamp-none">
                    {{ milestone.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side Cards (Desktop) / All Cards (Mobile) -->
          <div class="absolute top-0 right-0 md:w-[calc(50%-2rem)] w-[calc(100%-6rem)] left-16 md:left-auto">
            <div 
              v-for="(milestone, index) in milestones" 
              :key="`right-${index}`"
              v-show="index % 2 === 1 || true"
              class="group absolute w-full"
              :class="{ 'md:hidden': index % 2 === 0 }"
              :style="{ top: `${60 + index * 190}px`, transform: 'translateY(-50%)' }"
            >
              <div class="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 rounded-3xl overflow-hidden border border-slate-100">
                <div class="p-6 space-y-2">
                  <!-- Date -->
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <p class="text-amber-600 italic text-lg font-semibold">{{ milestone.date }}</p>
                  </div>
                  
                  <!-- Title -->
                  <h3 class="text-2xl text-stone-800 font-bold leading-tight group-hover:text-amber-700 transition-colors duration-300">
                    {{ milestone.title }}
                  </h3>
                  
                  <!-- Description -->
                  <p class="text-stone-600 text-lg leading-tight line-clamp-2 ">
                    {{ milestone.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline Dots -->
          <div class="absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 pl-0.5 md:pl-0">
            <div 
              v-for="(milestone, index) in milestones" 
              :key="`dot-${index}`"
              class="w-6 h-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg border-4 border-white z-10 hover:scale-110 transition-transform duration-300 absolute"
              :style="{ top: `${60 + index * 190}px`, transform: 'translate(-50%, -50%)' }"
            >
              <div class="absolute inset-1 bg-white rounded-full opacity-20"></div>
            </div>
          </div>
        </div>

        <!-- View Full Timeline Button (only show when not expanded and there are more items) -->
        <div v-if="showViewMoreButton" class="flex justify-center mt-8 md:mt-12">
          <a 
            href="/timeline" 
            class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-xl tracking-wide group flex items-center justify-center gap-2"
          >
            <span>View Full Timeline</span>
            <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
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

// Configuration
const MAX_TIMELINE_ITEMS = 5;

// Service times and contact info constants (you may need to define these in your app)
const SERVICE_TIMES = {
  SATURDAY: { VESPERS: "6:00 PM" },
  SUNDAY: { DIVINE_LITURGY: "9:00 AM" }
};

const CONTACT_INFO = {
  FR_NIKITA: { MESSAGE: "Please contact Fr. Nikita for more information." }
};

const allMilestones = ref([
  {
    date: "March 2024",
    title: "Corporation Formation",
    description: "Filed for corporation, Nativity of the Mother of God. Group has chosen the officers for the Corporation.",
  },
  {
    date: "February 2024",
    title: "Community Formation",
    description: `Group has formed and a small community has been established. As of now, Vespers is Saturday at ${SERVICE_TIMES.SATURDAY.VESPERS} and Hours and Liturgy begin at ${SERVICE_TIMES.SUNDAY.DIVINE_LITURGY} Sunday morning. Location is at Fr Nikita's House. ${CONTACT_INFO.FR_NIKITA.MESSAGE}`,
  },
  {
    date: "January 2024",
    title: "Episcopal Blessing",
    description: "Received blessing from his eminence, Bishop John of the Russian Orthodox Church Outside of Russia, to establish the Old-Rite mission in Woodburn Oregon dedicated to the Nativity of the Mother of God.",
  },
  {
    date: "December 2023",
    title: "Initial Planning",
    description: "Began discussions and planning for establishing an Orthodox Old Rite mission in the Woodburn area.",
  },
  {
    date: "November 2023",
    title: "First Gathering",
    description: "First informal gathering of interested community members to discuss the possibility of forming a mission.",
  },
]);

const milestones = computed(() => {
  return props.expanded ? allMilestones.value : allMilestones.value.slice(0, MAX_TIMELINE_ITEMS);
});

const showViewMoreButton = computed(() => {
  return !props.expanded && allMilestones.value.length > MAX_TIMELINE_ITEMS;
});
</script>

<style scoped>

</style>