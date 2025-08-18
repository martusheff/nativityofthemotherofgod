<template>
  <div class="relative">
    <div class="relative z-10 container mx-auto max-w-full md:max-w-7xl px-0 sm:px-8">
      <div class="flex flex-col md:grid md:grid-cols-2 md:gap-12 md:items-center items-center text-center md:text-left gap-8 md:py-16">
        <div class="w-full md:order-1">
          <NuxtImg 
          
            :src="home?.heroImage" 
            preset="seo"
            :modifiers="{ mobile: { preset: 'mobile' } }"
            sizes="sm:600px md:1200px"
            loading="eager"
            fetchpriority="high"
            alt="Icon of the Nativity of the Mother of God"
            class="w-full h-auto max-h-60 md:max-h-[600px] object-cover aspect-[4/3] md:aspect-auto shadow-md md:rounded-3xl "
          />
          <p class="text-stone-600 italic mt-4 text-center hidden md:block">
            {{ home?.heroImageDescription }}
          </p>
        </div>
        <div class="space-y-4 md:space-y-6 px-0 md:px-0 md:order-2">
          <h1 class="text-xl md:text-6xl text-stone-800 font-bold md:font-black leading-tight tracking-tighter md:tracking-tight px-2 md:px-0">
            {{ home?.title }}
          </h1>
          <p class="text-xl md:text-3xl text-amber-600 italic px-4 md:px-0">
            {{ home?.subTitle }}
          </p>
          <p class="text-lg md:text-xl text-stone-600 leading-relaxed px-4 md:px-0">
            {{ home?.description }}
          </p>
          <div class="flex gap-4 md:gap-6 p-4 md:p-0 md:pt-8">
            <NuxtLink
              v-if="home?.heroPrimaryCTALabel && home?.heroPrimaryCTAURL"
              :to="home?.heroPrimaryCTAURL ?? '#'"
              class="flex-1 md:flex-none w-full md:w-auto text-center flex justify-center bg-amber-500 md:bg-gradient-to-r md:from-amber-500 md:to-amber-600 text-lg md:text-xl hover:bg-amber-600 md:hover:from-amber-600 md:hover:to-amber-700 text-white font-medium py-3 md:py-5 px-6 md:px-10 rounded-full shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-2xl md:transform md:hover:-translate-y-2 transition-all duration-300 md:tracking-wide group"
            >
              <span class="md:group-hover:scale-105 md:transition-transform md:duration-300">{{ home?.heroPrimaryCTALabel }}</span>
            </NuxtLink>
            <RouterLink
              v-if="home?.heroSecondaryCTALabel && home?.heroSecondaryCTAURL"
              :to="home?.heroSecondaryCTAURL ?? '#'"
              class="flex-1 md:flex-none w-full md:w-auto text-center flex justify-center bg-white md:bg-white/90 md:backdrop-blur-sm border border-stone-300 md:border-slate-200 hover:border-stone-400 md:hover:border-slate-300 text-stone-700 md:text-slate-700 md:hover:text-slate-800 font-medium py-3 md:py-5 px-6 md:px-10 rounded-full shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-2xl md:transform md:hover:-translate-y-2 transition-all duration-300 text-lg md:text-xl md:tracking-wide group"
            >
              <span class="md:group-hover:scale-105 md:transition-transform md:duration-300">{{ home?.heroSecondaryCTALabel }}</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData } from 'nuxt/app';

const { data: home } = await useAsyncData(
  'home-page',
  () => queryCollection('pages').path('/pages/home').first(),
  {
    server: true,
    lazy: false,
  }
);

</script>