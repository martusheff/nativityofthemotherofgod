<template>
  <!-- About the Parish -->
  <div class="mx-auto max-w-full md:max-w-7xl px-4">
    <div class="flex flex-col items-center text-center gap-8 py-8">
      <h2 class="text-4xl md:text-5xl text-stone-800 font-bold leading-tight tracking-tight">
        About Our Parish
      </h2>
      <svg class="w-32 h-auto text-amber-600" viewBox="0 0 100 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 5 H50 C75 5 75 0 100 5" stroke="currentColor" stroke-width="2" />
      </svg>
      <p class="text-lg md:text-2xl text-stone-600 leading-relaxed max-w-4xl px-4">
        We are the Nativity of the Mother of God Old Rite Russian Orthodox Church, a new community under ROCOR,
        faithfully following the Old Calendar. If you are inquiring as a new visitor please contact Fr. Nikita.
      </p>
    </div>

    <div class="flex flex-col gap-16 ">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 md:items-center bg-white/80 p-8 md:p-12 md:px-16 rounded-4xl shadow-lg/2">
        <div class="md:col-span-3 space-y-2 text-center md:text-left">
          <h3 class="text-3xl md:text-5xl text-amber-600 italic font-semibold text-center">Our Faith</h3>
          <p class="text-lg md:text-2xl text-stone-600 leading-relaxed text-center">
            We are a parish dedicated to preserving the traditions of the Orthodox Old Rite, maintaining the ancient
            liturgical practices and spiritual heritage of the Church. Our community is rooted in prayer, fasting,
            and the pursuit of holiness according to the teachings of the Holy Fathers.
          </p>
        </div>
        <div class="md:col-span-2 w-full flex justify-center">
          <NuxtImg src="/parish.jpg" class="w-80 h-80 object-cover rounded-full shadow-lg" loading="lazy"
            alt="Orthodox Old Rite Church" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 md:items-center bg-white/80  p-8 md:p-12 md:px-16 rounded-4xl shadow-lg/2">
        <div class="md:col-span-2 w-full order-2 md:order-1 flex justify-center">
          <NuxtImg src="/community.jpg" class="w-80 h-80 object-cover rounded-full shadow-lg" loading="lazy"
            alt="Our Community Gathering" />
        </div>
        <div class="md:col-span-3 space-y-2 order-1 md:order-2 text-center md:text-left">
          <h3 class="text-3xl md:text-5xl text-amber-600 italic font-semibold text-center">Our Community</h3>
          <p class="text-lg md:text-2xl text-stone-600 leading-relaxed text-center">
            We are a growing family of believers united in Christ, welcoming all who seek to worship in the
            traditional Orthodox manner. From families to individuals, we come together to support one another in
            faith and community.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style></style>