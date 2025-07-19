<script lang="ts" setup>
import Timeline from './_components/timeline.vue';

const { data: timelinePage } = await useAsyncData(() =>
  queryCollection('pages').path('/pages/timeline').first()
);

</script>

<template>
  <div>
    <HeroLowImpact :title="timelinePage?.title" :subtitle="timelinePage?.subTitle"/>
    <Timeline :expanded="true"/>
  </div>
</template>