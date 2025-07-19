<script setup lang="ts">
import { computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ArticleCard from './article-card.vue';

const { data: home } = await useAsyncData(() =>
  queryCollection('pages').path('/pages/home').first()
);

const { data: articles } = await useAsyncData(() => queryCollection('articles').all())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
});

const swiperModules = [Autoplay, Navigation, Pagination, Mousewheel];

// Function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  
  // Add ordinal suffix to day
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
};

// Sort articles by date (newest first) and limit to 7 most recent
const articleItems = computed(() => {
  if (!articles.value) return [];
  
  return articles.value
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(article => ({
      ...article,
      formattedDate: formatDate(article.date)
    }));
});

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
            <ArticleCard :article="item" :list="false" />
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