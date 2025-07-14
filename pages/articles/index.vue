<script setup lang="ts">
import { ref, computed } from 'vue';

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
    tags: ['Worship', 'Tradition', 'Old Rite', 'Spirituality'],
    featured: true
  },
  {
    id: 'community-in-faith',
    title: 'Community in Faith',
    date: 'May 25, 2025',
    author: 'Fr. Nikita',
    description: 'How our parish fosters unity and support through shared worship and fellowship.',
    image: '/community.jpg',
    readTime: '6 min read',
    tags: ['Community', 'Fellowship', 'Parish Life'],
    featured: false
  },
  {
    id: 'preparing-for-nativity-feast',
    title: 'Preparing for the Nativity Feast',
    date: 'April 15, 2025',
    author: 'Fr. Nikita',
    description: 'A guide to the liturgical and communal preparations for the Nativity of the Mother of God.',
    image: '/parish.jpg',
    readTime: '10 min read',
    tags: ['Liturgy', 'Feast Days', 'Preparation'],
    featured: false
  },
  {
    id: 'prayer-and-contemplation',
    title: 'Prayer and Contemplation in Daily Life',
    date: 'March 20, 2025',
    author: 'Fr. Nikita',
    description: 'Practical guidance for maintaining a contemplative spirit amidst the demands of modern life.',
    image: '/parish.jpg',
    readTime: '7 min read',
    tags: ['Prayer', 'Contemplation', 'Daily Life'],
    featured: false
  },
  {
    id: 'icons-windows-to-heaven',
    title: 'Icons: Windows to Heaven',
    date: 'February 14, 2025',
    author: 'Fr. Nikita',
    description: 'Understanding the theological and spiritual significance of icons in Orthodox worship.',
    image: '/community.jpg',
    readTime: '9 min read',
    tags: ['Icons', 'Theology', 'Art', 'Worship'],
    featured: false
  },
  {
    id: 'fasting-and-spiritual-discipline',
    title: 'Fasting and Spiritual Discipline',
    date: 'January 28, 2025',
    author: 'Fr. Nikita',
    description: 'The role of fasting in Orthodox spirituality and its benefits for modern believers.',
    image: '/parish.jpg',
    readTime: '8 min read',
    tags: ['Fasting', 'Discipline', 'Spirituality'],
    featured: false
  }
]);

// Filter and search functionality
const searchQuery = ref('');
const selectedTag = ref('');

// Get all unique tags
const allTags = computed(() => {
  const tags = new Set();
  articlesData.value.forEach(article => {
    article.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
});

// Filter articles based on search and tag
const filteredArticles = computed(() => {
  let filtered = articlesData.value;
  
  if (searchQuery.value) {
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
  }
  
  if (selectedTag.value) {
    filtered = filtered.filter(article => 
      article.tags.includes(selectedTag.value)
    );
  }
  
  return filtered;
});

// Featured article (first one)
const featuredArticle = computed(() => 
  articlesData.value.find(article => article.featured) || articlesData.value[0]
);

// Regular articles (excluding featured)
const regularArticles = computed(() => 
  filteredArticles.value.filter(article => !article.featured || article.id !== featuredArticle.value.id)
);

// Clear filters
const clearFilters = () => {
  searchQuery.value = '';
  selectedTag.value = '';
};

// SEO Meta
useSeoMeta({
  title: 'Articles - Orthodox Old Rite Parish',
  description: 'Read insights and reflections on Orthodox faith, tradition, and parish life from Fr. Nikita and our community.',
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-slate-200">
      <div class="container mx-auto max-w-full md:max-w-7xl px-8 py-16">
        <div class="text-center space-y-6">
          <h1 class="text-4xl md:text-5xl text-stone-800 font-bold leading-tight tracking-tight">
            Articles & Reflections
          </h1>
          <svg class="w-32 h-auto mx-auto text-amber-600" viewBox="0 0 100 10" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M0 5 H50 C75 5 75 0 100 5" stroke="currentColor" stroke-width="2" />
          </svg>
          <p class="text-lg md:text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
            Stay informed about our parish life and Orthodox teachings with insights and reflections from Fr. Nikita.
          </p>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white border-b border-slate-200">
      <div class="container mx-auto max-w-full md:max-w-7xl px-8 py-8">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <!-- Search -->
          <div class="relative flex-1">
            <UInput
              v-model="searchQuery"
              type="text"
              placeholder="Search articles..."
              class="w-full px-4 pl-16  bg-gray-50 border border-slate-200 rounded-full text-stone-700 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
            />
            <svg class="absolute left-8 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Tag Filter -->
          <div class="flex items-center gap-4">
            <select
              v-model="selectedTag"
              class="px-4 py-3 bg-gray-50 border border-slate-200 rounded-full text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
            >
              <option value="">All Topics</option>
              <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
            </select>

            <button
              v-if="searchQuery || selectedTag"
              @click="clearFilters"
              class="px-4 py-3 text-stone-600 hover:text-stone-800 font-medium transition-colors duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Article -->
    <div v-if="!searchQuery && !selectedTag" class="bg-white">
      <div class="container mx-auto max-w-full md:max-w-7xl px-8 py-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl text-stone-800 font-bold mb-4">Featured Article</h2>
        </div>
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Image -->
          <div class="relative overflow-hidden rounded-2xl shadow-lg group">
            <NuxtImg :src="featuredArticle.image" 
              class="w-full h-auto max-h-96 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="eager"
              :alt="featuredArticle.title" />
            <div class="absolute top-4 right-4">
              <div class="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                Featured
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="space-y-6">
            <div class="flex flex-wrap items-center gap-4 text-sm text-stone-600">
              <span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                {{ featuredArticle.date }}
              </span>
              <span>By {{ featuredArticle.author }}</span>
              <span>{{ featuredArticle.readTime }}</span>
            </div>

            <h3 class="text-3xl text-stone-800 font-bold leading-tight">
              {{ featuredArticle.title }}
            </h3>

            <p class="text-lg text-stone-600 leading-relaxed">
              {{ featuredArticle.description }}
            </p>

            <div class="flex flex-wrap gap-2">
              <span v-for="tag in featuredArticle.tags" :key="tag"
                class="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm">
                {{ tag }}
              </span>
            </div>

            <div class="pt-4">
              <UButton
                class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-4 px-8 rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-lg tracking-wide group/btn"
                :to="`/articles/${featuredArticle.id}`">
                <span class="group-hover/btn:scale-105 transition-transform duration-300">Read Full Article</span>
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Articles Grid -->
    <div class="container mx-auto max-w-full md:max-w-7xl px-8 py-16">
      <div class="flex items-center justify-between mb-12">
        <h2 class="text-3xl text-stone-800 font-bold">
          {{ searchQuery || selectedTag ? 'Search Results' : 'All Articles' }}
        </h2>
        <div class="text-stone-600">
          {{ filteredArticles.length }} article{{ filteredArticles.length !== 1 ? 's' : '' }}
        </div>
      </div>

      <!-- No Results -->
      <div v-if="filteredArticles.length === 0" class="text-center py-16">
        <div class="text-stone-400 text-6xl mb-4">📝</div>
        <h3 class="text-xl text-stone-700 font-medium mb-2">No articles found</h3>
        <p class="text-stone-600 mb-6">Try adjusting your search or filters</p>
        <UButton
          @click="clearFilters"
          class="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
          Clear Filters
        </UButton>
      </div>

      <!-- Articles Grid -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="article in regularArticles" :key="article.id"
          class="bg-white/95 backdrop-blur-sm border border-slate-200/50 hover:border-amber-200 shadow-lg hover:shadow-xl transform transition-all duration-500 rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-2">
          
          <!-- Image -->
          <div class="relative overflow-hidden h-48">
            <NuxtImg :src="article.image"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy" :alt="article.title" />
            <div class="absolute top-4 right-4">
              <div class="bg-white/90 backdrop-blur-sm text-amber-600 px-3 py-1 rounded-full text-sm font-medium shadow-md">
                {{ article.date }}
              </div>
            </div>
          </div>
          
          <!-- Content -->
          <div class="p-6 space-y-4 flex-1 flex flex-col">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-sm text-stone-600">
                <span>By {{ article.author }}</span>
                <span>•</span>
                <span>{{ article.readTime }}</span>
              </div>
              <h3 class="text-xl text-stone-800 font-bold leading-tight group-hover:text-amber-700 transition-colors duration-300 line-clamp-2">
                {{ article.title }}
              </h3>
            </div>
            
            <p class="text-stone-600 text-base leading-relaxed line-clamp-3 flex-1">
              {{ article.description }}
            </p>

            <div class="flex flex-wrap gap-2 py-2">
              <span v-for="tag in article.tags.slice(0, 2)" :key="tag"
                class="bg-stone-100 text-stone-700 px-2 py-1 rounded-full text-xs">
                {{ tag }}
              </span>
              <span v-if="article.tags.length > 2" class="text-stone-500 text-xs px-2 py-1">
                +{{ article.tags.length - 2 }} more
              </span>
            </div>
            
            <div class="pt-4 mt-auto">
              <UButton
                class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-base tracking-wide group/btn"
                :to="`/articles/${article.id}`">
                <span class="group-hover/btn:scale-105 transition-transform duration-300">Read More</span>
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Newsletter Signup -->
    <div class="bg-white border-t border-slate-200">
      <div class="container mx-auto max-w-full md:max-w-7xl px-8 py-16">
        <div class="text-center max-w-2xl mx-auto">
          <h2 class="text-3xl text-stone-800 font-bold mb-4">Stay Updated</h2>
          <p class="text-lg text-stone-600 mb-8">
            Subscribe to receive the latest articles and updates from our parish community.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              class="flex-1 px-4 py-3 bg-gray-50 border border-slate-200 rounded-full text-stone-700 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
            />
            <UButton
              class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 whitespace-nowrap">
              Subscribe
            </UButton>
          </div>
        </div>
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
</style>