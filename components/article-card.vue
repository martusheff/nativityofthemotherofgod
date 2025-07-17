<script setup lang="ts">
defineProps<{
  article: {
    title: string
    author: string
    description: string
    image: string
    formattedDate: string
    path?: string
  },
  list?: boolean
}>()
</script>

<template>
  <div :class="[
    'bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transform transition-all duration-300 rounded-3xl overflow-hidden flex group',
    list ? 'flex-col md:flex-row md:h-[250px]' : 'flex-col  min-h-[500px] md:h-[500px]'
  ]">
    <div :class="[
      'relative overflow-hidden',
      list ? 'w-full md:w-1/3 h-[200px] md:h-full flex-shrink-0' : 'h-[170px] md:h-[200px]'
    ]">
      <NuxtImg :src="article.image" :alt="article.title" class="w-full h-full object-cover" loading="lazy" />
    </div>

    <div :class="[
      'p-4 md:p-6 space-y-2 md:space-y-4 flex-1 flex flex-col',
      list ? 'md:w-2/3' : ''
    ]">
      <div class="space-y-2">
        <div class="flex flex-wrap items-center text-sm md:text-base text-stone-500 gap-2">
          <span class="italic">{{ article.formattedDate }}</span>
          <span class="mx-2 text-stone-400">•</span>
          <span class="italic">{{ article.author }}</span>
        </div>


        <h3
          class="text-2xl text-stone-800 font-semibold leading-tight group-hover:text-amber-700 transition-colors duration-300 line-clamp-2">
          {{ article.title }}
        </h3>
      </div>
      <p :class="['text-stone-600 text-lg leading-tight text-justify', list ? 'line-clamp-1' : 'line-clamp-5']">
        {{ article.description }}
      </p>
      <div class="pt-4 pb-2 mt-auto">
        <UButton
          class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-xl tracking-wide group flex items-center justify-center gap-2"
          :to="article.path || '/articles'">
          <span>Read More</span>
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
