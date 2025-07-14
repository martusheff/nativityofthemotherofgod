<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Mock articles data
const articlesData = ref([
  {
    id: 'beauty-of-old-rite-worship',
    title: 'The Beauty of Old Rite Worship',
    date: 'June 10, 2025',
    author: 'Fr. Nikita',
    description: 'A reflection on the timeless traditions of the Orthodox Old Rite and their significance in our spiritual lives.',
    image: '/parish.jpg',
    readTime: '8 min read',
    content: `
      <p>Example</>
    `,
    tags: ['Worship', 'Tradition', 'Old Rite', 'Spirituality'],
    relatedArticles: [
      {
        title: 'Community in Faith',
        slug: 'community-in-faith',
        image: '/community.jpg'
      },
      {
        title: 'Preparing for the Nativity Feast',
        slug: 'preparing-for-nativity-feast',
        image: '/parish.jpg'
      }
    ]
  }
]);

// Get current article based on route
const currentArticle = computed(() => {
  const slug = route.params.slug || 'beauty-of-old-rite-worship';
  return articlesData.value.find(article => article.id === slug) || articlesData.value[0];
});

// SEO Meta
useSeoMeta({
  title: currentArticle.value?.title,
  description: currentArticle.value?.description,
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="relative bg-white border-b border-slate-200">
      <div class="container mx-auto max-w-4xl px-8 py-16">
        <!-- Breadcrumb -->
        <nav class="mb-8">
          <ol class="flex items-center space-x-2 text-sm text-stone-600">
            <li><NuxtLink to="/" class="hover:text-amber-600 transition-colors">Home</NuxtLink></li>
            <li class="text-stone-400">/</li>
            <li><NuxtLink to="/articles" class="hover:text-amber-600 transition-colors">Articles</NuxtLink></li>
            <li class="text-stone-400">/</li>
            <li class="text-stone-800 font-medium">{{ currentArticle.title }}</li>
          </ol>
        </nav>

        <!-- Article Meta -->
        <div class="flex flex-wrap items-center gap-4 mb-6">
          <div class=" text-amber-700 py-1 rounded-full text-sm font-medium">
            {{ currentArticle.date }}
          </div>
          <div class="text-stone-600 text-sm">
            By {{ currentArticle.author }}
          </div>
          <div class="text-stone-600 text-sm">
            {{ currentArticle.readTime }}
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-4xl md:text-5xl text-stone-800 font-bold leading-tight tracking-tight mb-6">
          {{ currentArticle.title }}
        </h1>

            <!-- Article Image -->
    <div class="bg-white">
      <div class="container mx-auto py-8">
        <div class="relative overflow-hidden rounded-2xl shadow-lg">
          <NuxtImg :src="currentArticle.image" 
            class="w-full h-auto max-h-96 object-cover" 
            loading="eager"
            :alt="currentArticle.title" />
        </div>
      </div>
    </div>

        <!-- Description -->
        <p class="text-xl text-stone-600 leading-relaxed mb-8">
          {{ currentArticle.description }}
        </p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-8">
          <span v-for="tag in currentArticle.tags" :key="tag"
            class="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm hover:bg-stone-200 transition-colors">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>



    <!-- Article Content -->
    <div class="bg-white">
      <div class="container mx-auto max-w-4xl px-8 py-16">
        <div class="prose prose-lg prose-stone max-w-none">
          <div v-html="currentArticle.content" class="article-content"></div>
        </div>
      </div>
    </div>

    <!-- Related Articles -->
    <div class="bg-gray-50 border-t border-slate-200">
      <div class="container mx-auto max-w-4xl px-8 py-16">
        <h2 class="text-3xl text-stone-800 font-bold mb-8">Related Articles</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div v-for="article in currentArticle.relatedArticles" :key="article.slug"
            class="bg-white/95 backdrop-blur-sm border border-slate-200/50 hover:border-amber-200 shadow-lg hover:shadow-xl transform transition-all duration-500 rounded-2xl overflow-hidden group hover:-translate-y-2">
            <div class="relative overflow-hidden h-48">
              <NuxtImg :src="article.image"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy" :alt="article.title" />
            </div>
            <div class="p-6">
              <h3 class="text-xl text-stone-800 font-bold leading-tight group-hover:text-amber-700 transition-colors duration-300 mb-4">
                {{ article.title }}
              </h3>
              <UButton
                class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-base tracking-wide group/btn"
                :to="`/articles/${article.slug}`">
                <span class="group-hover/btn:scale-105 transition-transform duration-300">Read Article</span>
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Back to Articles -->
    <div class="bg-white border-t border-slate-200">
      <div class="container mx-auto max-w-4xl px-8 py-12">
        <div class="text-center">
          <UButton
            class="bg-white/90 backdrop-blur-sm border border-slate-200 hover:border-slate-300 text-stone-700 hover:text-stone-800 font-medium py-4 px-10 rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-lg tracking-wide group"
            to="/articles">
            <span class="group-hover:scale-105 transition-transform duration-300">← Back to All Articles</span>
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>