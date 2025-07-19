<script setup lang="ts">
import Timeline from './timeline/_components/timeline.vue';
import Articles from './articles/_components/articles.vue';
import About from './about/_components/about.vue';
import Events from './schedule/_components/events.vue';
import Divider from '../components/divider.vue';

const { data: home } = await useAsyncData(() =>
  queryCollection('pages').path('/pages/home').first()
);

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
});

</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-stone-50 py-0 flex flex-col gap-8">
    <HeroHome />
    <CtaHorizontal title="Want to Visit?"
      subtitle="While our parish is still in its early stages, we are open to visitors. Please contact us in advance if you'd like to visit a service, or follow the link to learn more about what to expect during your visit."
      primarylabel="Contact" primaryurl="/contact" />
    <Timeline :expanded="false" />
    <Events />
    <About />
    <Articles />
    <div class="w-full max-w-8xl mx-auto md:px-8 py-12">
      <Divider size="text-6xl" iconSize="w-14 h-14" class="md:mt-4 mb-14 " />
    </div>
  </div>
</template>

<style scoped></style>
