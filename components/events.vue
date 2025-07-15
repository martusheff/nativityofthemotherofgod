<script setup lang="ts">
import { ref, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Mousewheel, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const { data: home } = await useAsyncData(() =>
  queryCollection('pages').path('/pages/home').first()
)

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
})

const swiperModules = [Autoplay, Navigation, Pagination, Mousewheel]

const weeklyServices = [
  {
    title: 'Divine Liturgy',
    date: 'Every Sunday, 8:30 AM',
    description:
      'Join us for the Divine Liturgy, the heart of our worship, celebrating the Eucharist in the Old Rite tradition.',
  },
  {
    title: 'Vespers Service',
    date: 'Every Saturday, 5:00 PM',
    description:
      'Evening prayers to prepare our hearts for the Lord’s Day, filled with chant and reflection.',
  },
]

const { data: scheduleEvents } = await useAsyncData(() =>
  queryCollection('events').all()
)

const today = new Date()
today.setHours(0, 0, 0, 0)

const dynamicEvents = computed(() => {
  if (!scheduleEvents.value) return []
  return scheduleEvents.value
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)
    .map(event => ({
      title: event.title,
      date: new Date(event.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      description: event.description,
    }))
})

const eventItems = computed(() => [
  ...weeklyServices,
  ...dynamicEvents.value,
])
</script>

<template>
  <div class="mx-auto w-full md:max-w-7xl px-4 md:px-8">
    <div
      class="flex flex-col accentedBg rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300 gap-8">
      <div class="text-center space-y-6">
        <h2 class="text-3xl md:text-4xl text-stone-800 font-bold leading-tight tracking-tight">
          Upcoming Services & Events
        </h2>
        <svg class="w-32 h-auto mx-auto text-amber-600" viewBox="0 0 100 10" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M0 5 H50 C75 5 75 0 100 5" stroke="currentColor" stroke-width="2" />
        </svg>
      </div>
      <div class="overflow-hidden">
        <Swiper :modules="swiperModules" :slides-per-view="1" :space-between="24"
          :breakpoints="{ 640: { slidesPerView: 1, spaceBetween: 24 }, 1024: { slidesPerView: 3, spaceBetween: 32 } }"
          :pagination="{ clickable: true }" :autoplay="{ delay: 7500, disableOnInteraction: true }" :loop="false"
          :navigation="false" class="w-full swiper-container-events">
          <SwiperSlide v-for="(item, index) in eventItems" :key="index">
            <UCard
              class="bg-white/90 backdrop-blur-sm shadow-lg h-40 hover:shadow-xl transition-all duration-300 flex flex-col rounded-3xl items-center justify-start">
              <div class="p-4 space-y-1 flex-1 flex flex-col text-center">
                <h3 class="text-xl text-stone-800 font-semibold leading-tight">{{ item.title }}</h3>
                <p class="text-amber-600 italic text-md">{{ item.date }}</p>
                <p class="text-stone-600 text-base flex-1 line-clamp-2">{{ item.description }}</p>
              </div>
            </UCard>
          </SwiperSlide>
        </Swiper>
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
