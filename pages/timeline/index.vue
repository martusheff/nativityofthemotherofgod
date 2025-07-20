<script lang="ts" setup>
import LowImpactHero from '~/components/heroes/low-impact-hero.vue';
import Timeline from './_components/timeline.vue';

const { data: timelinePage } = await useAsyncData(() =>
  queryCollection('pages').path('/pages/timeline').first()
);

</script>

<template>
  <div>
    <LowImpactHero :title="timelinePage?.title" :subtitle="timelinePage?.subTitle"/>
    <Timeline :expanded="true"/>
  </div>
</template>