<script setup lang="ts">
import HomeHero from '~/components/heroes/home-hero.vue';

const { data: home } = await useAsyncData(() =>
  queryCollection('pages').path('/pages/home').first()
);

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
});



</script>

<template>
  <section class="min-h-screen bg-gradient-to-br from-slate-50 to-stone-50 py-0 flex flex-col gap-8">
    <HomeHero />

    <div class="mx-auto w-full md:max-w-7xl px-4 pt-4">
      <div
        class="flex flex-col md:flex-row items-center justify-between accentedBg rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300 gap-8">
        <div class="flex-1 space-y-3 text-center md:text-left">
          <h3 class="text-2xl md:text-4xl text-stone-800 font-semibold leading-tight">
            Want to Visit?
          </h3>
          <p class="text-xl text-stone-600 leading-tight max-w-4xl">
            While our parish is still in its early stages, we are open to visitors. Please contact us in advance if
            you'd like to visit a service, or follow the link to learn more about what to expect during your visit.
          </p>
        </div>
        <div class="md:ml-8">
          <UButton
            class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-xl tracking-wide group flex items-center justify-center gap-2"
            to="/contact">
            <span class="transition-transform duration-300">Contact</span>
          </UButton>
        </div>
      </div>
    </div>

    <Timeline />

    <Events />

    <About />




    <Articles />


    <!-- <div class="mx-auto w-full md:max-w-7xl px-4 py-16 pb-32">
      <div
        class="flex flex-col md:flex-row items-center justify-between accentedBg rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300 gap-8">
        <div class="flex-1 space-y-3 text-center md:text-left">
          <h3 class="text-2xl md:text-4xl text-stone-800 font-semibold leading-tight">
            Church Calendar
          </h3>
          <p class="text-xl text-stone-600 leading-tight">
            View feast days, liturgical seasons, the fasting schedule and other important dates in our Orthodox old
            calendar.
          </p>
        </div>
        <div class="md:ml-8">
          <UButton
            class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-xl tracking-wide group"
            to="/calendar">
            <span class="transition-transform duration-300">View Calendar</span>
          </UButton>
        </div>
      </div>
    </div> -->
    <div class="w-full max-w-8xl mx-auto md:px-8">
          <Divider size="text-6xl" iconSize="w-14 h-14" class="md:mt-4 mb-14 " />
    </div>



  </section>
</template>

<style scoped></style>
