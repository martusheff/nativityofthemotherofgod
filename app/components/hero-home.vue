<template>
  <!-- Home Hero with Background -->
  <div class="relative ">

    <!-- Content -->
    <div class="relative z-10 container mx-auto max-w-full md:max-w-7xl px-0 sm:px-8">
      <!-- Mobile/Tablet Layout -->
      <div class="md:hidden flex flex-col items-center text-center gap-8">
        <!-- Image Section -->
        <div class="w-full">
          <NuxtImg 
            :src="home?.heroImage" 
            class="w-full h-auto max-h-60 object-cover aspect-[4/3] shadow-md " 
            loading="eager"
            alt="Icon of the Nativity of the Mother of God" 
          />
        </div>

        <!-- Content Section -->
        <div class="space-y-4 px-0 md:px-0">
          <h1 class="text-xl text-stone-800 font-bold leading-tight tracking-tighter px-2">
            {{ home?.title }}
          </h1>
          <p class="text-xl text-amber-600 italic px-4">
            {{ home?.subTitle }}
          </p>
          <p class="text-lg text-stone-600 leading-relaxed px-4">
            {{ home?.description }}
          </p>

          <!-- Buttons -->
          <div class="flex md:flex-row gap-4 p-4">
            <NuxtLink
              class="flex-1 w-full text-center flex justify-center bg-amber-500 text-lg hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              :to="home?.heroPrimaryCTAURL ?? '#'" >
              {{home?.heroPrimaryCTALabel}}
            </NuxtLink>
            <RouterLink
              class="flex-1  w-full text-center flex justify-center bg-white border text-lg border-stone-300 hover:border-stone-400 text-stone-700 font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              :to="home?.heroSecondaryCTAURL ?? '#'" >
              {{home?.heroSecondaryCTALabel}}
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Desktop Layout -->
      <div class="hidden md:grid md:grid-cols-2 gap-12 items-center py-16">
        <!-- Image Section -->
        <div>
          <NuxtImg 
            :src="home?.heroImage" 
            class="w-full h-auto max-h-[600px] object-cover rounded-3xl shadow-md"
            loading="eager" 
            alt="Icon of the Nativity of the Mother of God" 
          />
          <p class="text-stone-600 italic mt-4 text-center">
            {{home?.heroImageDescription}}
          </p>
        </div>

        <!-- Content Section -->
        <div class="space-y-6">
          <h1 class="text-6xl text-stone-800 font-black leading-tight tracking-tight">
            {{ home?.title }}
          </h1>
          <p class="text-3xl text-amber-600 italic">
            {{ home?.subTitle }}
          </p>
          <p class="text-xl text-stone-600 leading-relaxed">
            {{ home?.description }}
          </p>

          <!-- Buttons -->
          <div class="flex gap-6 pt-8">
            <RouterLink
              :v-if="home?.heroPrimaryCTALabel && home?.heroPrimaryCTAURL" class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-5 px-10 rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-xl tracking-wide group"
              :to="home?.heroPrimaryCTAURL ?? '#'">
              <span class="group-hover:scale-105 transition-transform duration-300">{{home?.heroPrimaryCTALabel}}</span>
            </RouterLink>
            <RouterLink
              :v-if="home?.heroSecondaryCTALabel && home?.heroSecondaryCTAURL" class="bg-white/90 backdrop-blur-sm border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-800 font-medium py-5 px-10 rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-xl tracking-wide group"
              :to="home?.heroSecondaryCTAURL ?? '#'">
              <span class="group-hover:scale-105 transition-transform duration-300 text-lg">{{home?.heroSecondaryCTALabel}}</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useSeoMeta } from 'nuxt/app';

const { data: home } = await useAsyncData(() => queryCollection('pages').path('/pages/home').first())
useSeoMeta({
  title: home.value?.title,
  description: home.value?.description
})
</script>

<style>
</style>