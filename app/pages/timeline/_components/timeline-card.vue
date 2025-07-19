<script setup lang="ts" name="TimelineCard">
defineProps<{
  milestone: { title: string; description: string; formattedDate: string };
  align: 'left' | 'right';
}>();
</script>

<template #TimelineCard="{ milestone, align }">
  <div
    class="group bg-white/90 backdrop-blur-sm border border-stone-200 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 rounded-3xl p-6 space-y-2">
    <div class="flex items-center gap-3 w-full" :class="{ 'justify-start flex-row-reverse': align === 'right' }">
      <p class="text-amber-600 italic text-lg font-semibold" :class="{ 'text-left': align === 'right' }">
        {{ milestone.formattedDate }}
      </p>
      <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
    </div>
    <h3
      class="text-2xl text-stone-800 font-bold leading-tight group-hover:text-amber-700 transition-colors duration-300"
      :class="{ 'text-right': align === 'right' }">
      {{ milestone.title }}
    </h3>
    <p class="text-stone-600 text-lg leading-tight" :class="{ 'text-right': align === 'right' }">
      {{ milestone.description }}
    </p>
  </div>
</template>
