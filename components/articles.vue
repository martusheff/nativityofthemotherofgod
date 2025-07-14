<script setup lang="ts">
import HomeHero from '~/components/heroes/home-hero.vue';
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const { data: home } = await useAsyncData(() =>
  queryCollection('pages').path('/pages/home').first()
);

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
});

const swiperModules = [Autoplay, Navigation, Pagination, Mousewheel];

const articleItems = ref([
  {
    title: 'The Beauty of Old Rite Worship',
    date: 'June 10, 2025',
    description:
      'A reflection on the timeless traditions of the Orthodox Old Rite and their significance in our spiritual lives.',
    image: '/parish.jpg',
  },
  {
    title: 'Community in Faith',
    date: 'May 25, 2025',
    description:
      'How our parish fosters unity and support through shared worship and fellowship.',
    image: '/community.jpg',
  },
  {
    title: 'Preparing for the Nativity Feast',
    date: 'April 15, 2025',
    description:
      'A guide to the liturgical and communal preparations for the Nativity of the Mother of God.',
    image: '/parish.jpg',
  },
    {
    title: 'Preparing for the Nativity Feast',
    date: 'April 15, 2025',
    description:
      'A guide to the liturgical and communal preparations for the Nativity of the Mother of God.',
    image: '/parish.jpg',
  },
]);

</script>

<template>
  <!-- Articles -->
  <div class="container mx-auto max-w-full md:max-w-7xl px-4">
    <div class="flex flex-col gap-10 py-8">
      <div class="text-center space-y-6">
        <h2 class="text-4xl md:text-5xl text-stone-800 font-bold leading-tight tracking-tight">
          Recent Articles
        </h2>
        <svg class="w-32 h-auto mx-auto text-amber-600" viewBox="0 0 100 12" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M0 5 H50 C75 5 75 0 100 5" stroke="currentColor" stroke-width="2" />
        </svg>
        <!-- <p class="text-lg md:text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
          Stay informed about our parish life and Orthodox teachings with appraisals on relevant issues by Fr.
          Nikita.
        </p> -->
      </div>
      <div class="">
        <Swiper :modules="swiperModules" :slides-per-view="1" :space-between="32"
          :breakpoints="{ 640: { slidesPerView: 2, spaceBetween: 32 }, 1024: { slidesPerView: 3, spaceBetween: 32 } }"
          :pagination="{ clickable: true }" :autoplay="{ delay: 7500, disableOnInteraction: true }" :loop="false"
          :navigation="false" class="w-full swiper-container-articles">
          <SwiperSlide v-for="(item, index) in articleItems" :key="index">
            <div
              class="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transform transition-all duration-300 rounded-3xl overflow-hidden md:h-[500px] flex flex-col group">
              <div class="relative overflow-hidden h-[170px] md:h-[200px]">
                <NuxtImg :src="item.image"
                  class="w-full h-full object-cover "
                  loading="lazy" :alt="item.title" />
   
              </div>
              <div class="p-4 md:p-6 space-y-2 md:space-y-4 flex-1 flex flex-col">
                <div class="space-y-2">
                  <p class="text-amber-600 italic text-lg font-medium">{{ item.date }}</p>
                  <h3
                    class="text-2xl text-stone-800 font-semibold leading-tight group-hover:text-amber-700 transition-colors duration-300 line-clamp-2">
                    {{ item.title }}
                  </h3>
                </div>
                <p class="text-stone-600 text-lg leading-tight text-justify line-clamp-3 flex-1">
                  {{ item.description }}
                </p>
                <div class="pt-4 pb-2 mt-auto">
                  <UButton
                    class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-xl tracking-wide group flex items-center justify-center gap-2"
                    to="/articles">
                    <span class="group-hover/btn:scale-105 transition-transform duration-300">Read More</span>
                  </UButton>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div class="text-center">
        <UButton
                    class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-xl tracking-wide group flex items-center justify-center gap-2"
          to="/articles">
          <span class="group-hover:scale-105 transition-transform duration-300">View All Articles</span>
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

img {
  max-width: 100%;
  height: auto;
}

.swiper-container-articles,
.swiper-container-events {
  padding-bottom: 4rem;
}

:deep(.swiper-pagination) {
  position: absolute;
  bottom: 0px;
  z-index: 20;
}

:deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background-color: #78716c;
  opacity: 0.4;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #d97706;
  opacity: 1;
  transform: scale(1.2);
}
</style>
