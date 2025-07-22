<script lang="ts" setup>

const props = defineProps({
  title: String,
  subtitle: String,
  primarylabel: String,
  primaryurl: String
})

</script>

<template>
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
</template>


<style></style>