<script setup lang="ts">
const { data: donatePage } = await useAsyncData(() =>
  queryCollection('pages').path('/pages/donate').first()
)
useSeoMeta({
  title: 'Support Our Parish - Donations Coming Soon',
  description: 'Learn about upcoming donation opportunities to support our Orthodox parish community.',
})
</script>

<template>
    <HeroLowImpact :title="donatePage?.title" :subtitle="donatePage?.subTitle" />
</template>

<style scoped>

</style>
