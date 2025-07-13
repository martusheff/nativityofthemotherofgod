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
]);

const eventItems = ref([
  {
    title: 'Divine Liturgy',
    date: 'Every Sunday, 9:00 AM',
    description:
      'Join us for the Divine Liturgy, the heart of our worship, celebrating the Eucharist in the Old Rite tradition.',
  },
  {
    title: 'Vespers Service',
    date: 'Every Saturday, 6:00 PM',
    description:
      'Evening prayers to prepare our hearts for the Lords Day, filled with chant and reflection.',
  },
  {
    title: 'Community Feast',
    date: 'October 15, 2025',
    description:
      'A parish-wide gathering to share a meal and fellowship, celebrating our unity in Christ.',
  },
  {
    title: 'Community Feast',
    date: 'October 15, 2025',
    description:
      'A parish-wide gathering to share a meal and fellowship, celebrating our unity in Christ.',
  },
  {
    title: 'Community Feast',
    date: 'October 15, 2025',
    description:
      'A parish-wide gathering to share a meal and fellowship, celebrating our unity in Christ.',
  },
]);
</script>

<template>
  <section class="min-h-screen bg-gradient-to-br from-slate-50 to-stone-50 py-0 flex flex-col gap-8">
    <HomeHero />
    <Events />
    <Timeline />

    <!-- Church Calendar Section -->
    <div class="mx-auto w-full md:max-w-7xl px-8">
      <div
        class="flex flex-col md:flex-row items-center justify-between accentedBg rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300 gap-6">
        <div class="flex-1 space-y-3 text-center md:text-left">
          <h3 class="text-2xl md:text-4xl text-stone-800 font-semibold leading-tight">
            Church Calendar
          </h3>
          <p class="text-xl text-stone-600 leading-relaxed">
            View feast days, liturgical seasons, and important dates in our Orthodox calendar.
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
    </div>



    <!-- About the Parish -->
    <div class="mx-auto max-w-full md:max-w-7xl px-8">
      <div class="flex flex-col items-center text-center gap-8 py-16">
        <h2 class="text-4xl md:text-5xl text-stone-800 font-bold leading-tight tracking-tight">
          Welcome to Our Parish
        </h2>
        <svg class="w-32 h-auto text-amber-600" viewBox="0 0 100 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 5 H50 C75 5 75 0 100 5" stroke="currentColor" stroke-width="2" />
        </svg>
        <p class="text-lg md:text-2xl text-stone-600 leading-relaxed max-w-3xl px-4">
          Discover the timeless beauty of the Orthodox Old Rite at our parish, where faith, tradition, and community
          come together in worship and fellowship.
        </p>
      </div>

      <div class="flex flex-col gap-24 md:py-16">
        <div class="flex flex-col md:flex-row md:items-center gap-12 md:gap-20">
          <div class="flex-1 space-y-6 text-center md:text-left">
            <h3 class="text-3xl md:text-5xl text-amber-600 italic font-semibold">Our Faith</h3>
            <p class="text-lg md:text-2xl text-stone-600 leading-relaxed">
              We are a parish dedicated to preserving the traditions of the Orthodox Old Rite, maintaining the ancient
              liturgical practices and spiritual heritage of the Church. Our community is rooted in prayer, fasting,
              and the pursuit of holiness according to the teachings of the Holy Fathers.
            </p>
          </div>
          <div class="flex-1 w-full flex justify-end">
            <NuxtImg src="/parish.jpg" class="max-h-[20rem] w-full object-cover rounded-3xl shadow-md" loading="lazy"
              alt="Orthodox Old Rite Church" />
          </div>
        </div>

        <div class="flex flex-col md:flex-row md:items-center gap-12 md:gap-20">
          <div class="flex-1 w-full order-2 md:order-1">
            <NuxtImg src="/community.jpg" class="max-h-[20rem] w-full object-cover rounded-3xl shadow-md" loading="lazy"
              alt="Our Community Gathering" />
          </div>
          <div class="flex-1 space-y-6 order-1 md:order-2 text-center md:text-left">
            <h3 class="text-3xl md:text-5xl text-amber-600 italic font-semibold">Our Community</h3>
            <p class="text-lg md:text-2xl text-stone-600 leading-relaxed">
              We are a growing family of believers united in Christ, welcoming all who seek to worship in the
              traditional Orthodox manner. From families to individuals, we come together to support one another in
              faith and community.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Visitors Section -->
    <div class="mx-auto w-full md:max-w-7xl px-8">
      <div
        class="flex flex-col md:flex-row items-center justify-between accentedBg rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300 gap-6">
        <div class="flex-1 space-y-3 text-center md:text-left">
          <h3 class="text-2xl md:text-4xl text-stone-800 font-semibold leading-tight">
            We're Open to Visitors!
          </h3>
          <p class="text-xl text-stone-600 leading-relaxed max-w-4xl">
            While our parish is still in its early stages, we are open to visitors. Please contact us in advance if
            you'd like to visit a service, or follow the link to learn more about what to expect in your visit.
          </p>
        </div>
        <div class="md:ml-8">
          <UButton
            class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-xl tracking-wide group"
            to="/calendar">
            <span class="transition-transform duration-300">Visit</span>
          </UButton>
        </div>
      </div>
    </div>

    <!-- Articles -->
    <div class="container mx-auto max-w-full md:max-w-7xl px-8">
      <div class="flex flex-col gap-16 py-20">
        <div class="text-center space-y-6">
          <h2 class="text-4xl md:text-5xl text-stone-800 font-bold leading-tight tracking-tight">
            Recent Articles
          </h2>
          <svg class="w-32 h-auto mx-auto text-amber-600" viewBox="0 0 100 10" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M0 5 H50 C75 5 75 0 100 5" stroke="currentColor" stroke-width="2" />
          </svg>
          <p class="text-lg md:text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
            Stay informed about our parish life and Orthodox teachings with appraisals on relevant issues by Fr.
            Nikita.
          </p>
        </div>
        <div class="overflow-hidden">
          <Swiper :modules="swiperModules" :slides-per-view="1" :space-between="24"
            :breakpoints="{ 640: { slidesPerView: 2, spaceBetween: 24 }, 1024: { slidesPerView: 3, spaceBetween: 16 } }"
            :pagination="{ clickable: true }" :autoplay="{ delay: 7500, disableOnInteraction: true }" :loop="false"
            :navigation="false" class="w-full swiper-container-articles">
            <SwiperSlide v-for="(item, index) in articleItems" :key="index">
              <div
                class="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transform transition-all duration-300 rounded-3xl overflow-hidden h-[450px] flex flex-col group">
                <div class="relative overflow-hidden h-[200px]">
                  <NuxtImg :src="item.image"
                    class="w-full h-full object-cover group-hover:scale-[103%] transition-transform duration-300"
                    loading="lazy" :alt="item.title" />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  </div>
                </div>
                <div class="p-6 space-y-4 flex-1 flex flex-col">
                  <div class="space-y-2">
                    <p class="text-amber-600 italic text-sm font-medium">{{ item.date }}</p>
                    <h3
                      class="text-xl text-stone-800 font-semibold leading-tight group-hover:text-amber-700 transition-colors duration-300 line-clamp-2">
                      {{ item.title }}
                    </h3>
                  </div>
                  <p class="text-stone-600 text-base leading-relaxed line-clamp-3 flex-1">
                    {{ item.description }}
                  </p>
                  <div class="pt-4 pb-2 mt-auto">
                    <UButton
                      class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-base tracking-wide group/btn"
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
            class="bg-white/90 backdrop-blur-sm border border-slate-200 hover:border-slate-300 text-stone-700 hover:text-stone-800 font-medium py-4 px-10 rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-lg tracking-wide group"
            to="/articles">
            <span class="group-hover:scale-105 transition-transform duration-300">View All Articles</span>
          </UButton>
        </div>
      </div>
    </div>


  </section>
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
