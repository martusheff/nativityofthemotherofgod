<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from '#app'

// Fetch articles
const { data: articles } = await useAsyncData(() => queryCollection('articles').all())

const router = useRouter()
const route = useRoute()

useSeoMeta({
  title: 'Articles - Parish News and Orthodox Teachings',
  description: 'Browse parish articles on Orthodox life and teachings.',
})

const itemsPerPage = 9
const currentPage = ref(1)
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')

// Init page + search from URL
const initFromUrl = () => {
  const page = parseInt(route.query.page as string)
  currentPage.value = !isNaN(page) && page > 0 ? page : 1

  const q = route.query.q as string
  searchQuery.value = q ? q : ''
}
initFromUrl()

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  const month = d.toLocaleString('default', { month: 'long' })
  const day = d.getDate()
  const suffix = day > 3 && day < 21 ? 'th' : ['st', 'nd', 'rd'][((day % 10) - 1)] || 'th'
  return `${month} ${day}${suffix}, ${d.getFullYear()}`
}

const filteredArticles = computed(() => {
  if (!articles.value) return []
  return articles.value.filter(a =>
    a.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const sortedArticles = computed(() => {
  return [...filteredArticles.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(a => ({ ...a, formattedDate: formatDate(a.date) }))
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedArticles.value.length / itemsPerPage))
)

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return sortedArticles.value.slice(start, start + itemsPerPage)
})

// Watch URL -> state
watch(() => route.query.page, (newPage) => {
  const page = parseInt(newPage as string)
  currentPage.value = !isNaN(page) && page > 0 ? page : 1
})

watch(() => route.query.q, (newQ) => {
  searchQuery.value = newQ ? String(newQ) : ''
})

// Push state -> URL
const pushQuery = () => {
  const query = { ...route.query }

  if (currentPage.value <= 1) {
    delete query.page
  } else {
    query.page = String(currentPage.value)
  }

  if (searchQuery.value.trim() === '') {
    delete query.q
  } else {
    query.q = searchQuery.value.trim()
  }

  router.push({ query })
}

watch(currentPage, () => {
  pushQuery()
})

watch(searchQuery, () => {
  currentPage.value = 1
  pushQuery()
})

watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal
  }
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <section class="bg-stone-100 border-b border-stone-200 py-12">
      <div class="container mx-auto max-w-5xl px-4 text-center space-y-6">
        <h1 class="text-4xl md:text-6xl font-bold text-stone-800">Parish Articles</h1>
        <svg class="w-28 h-auto mx-auto text-amber-600" viewBox="0 0 100 12" fill="none">
          <path d="M0 5 H50 C75 5 75 0 100 5" stroke="currentColor" stroke-width="2" />
        </svg>
        <p class="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto">
          News and Orthodox teachings from Fr. Nikita.
        </p>
      </div>
    </section>

    <!-- Articles Section -->
    <section class="container mx-auto max-w-7xl px-4 py-12 space-y-8">



      <!-- Search + Actions Container -->
      <div class="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-7xl mx-auto pb-4 md:pt-8   md:pb-12">

        <!-- Search input with filter inside for mobile -->
        <div class="relative w-full max-w-2xl mx-auto flex-1">
          <UInput v-model="searchQuery" placeholder="Search articles..." size="lg"
            class="w-full rounded-full border border-stone-200 pr-12" :style="{ padding: '1rem 2rem' }" />
          <!-- Filter button INSIDE input (mobile) -->
          <button
            class="absolute hidden inset-y-0 right-3 flex md:hidden items-center justify-center text-stone-500 hover:text-stone-700"
            aria-label="Open filters">
            <Icon name="heroicons:adjustments-horizontal" size="22" />
          </button>
        </div>

        <!-- Actions: Toggle + Filter (desktop only) -->
        <div class="hidden md:flex items-center justify-end gap-3 md:pr-2 h-14">
          <!-- View toggle -->
          <UButton @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'"
            class="relative h-full text-stone-400 aspect-square rounded-full border border-stone-200 hover:bg-stone-100 flex items-center justify-center transition-all duration-300"
            aria-label="Toggle view mode">
            <Icon name="heroicons:squares-2x2" size="20" class="absolute transition-all duration-300"
              :class="viewMode === 'grid' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'" />
            <Icon name="heroicons:bars-3" size="20" class="absolute transition-all duration-300"
              :class="viewMode === 'list' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'" />
          </UButton>

          <!-- Filter button desktop -->
          <button
            class="w-10 h-10 flex hidden rounded-full border border-stone-300 hover:bg-stone-200  items-center justify-center transition-all duration-300"
            aria-label="Open filters">
            <Icon name="heroicons:adjustments-horizontal" size="20" />
          </button>
        </div>

      </div>



      <!-- Grid/List -->
      <div v-if="paginatedArticles.length" :class="[
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          : 'flex flex-col gap-8'
      ]">
        <ArticleCard v-for="article in paginatedArticles" :key="article.title" :article="article"
          :list="viewMode === 'list'" />
      </div>

      <!-- No results -->
      <div v-else class="text-center py-16">
        <h3 class="text-2xl font-semibold text-stone-800">No articles found</h3>
        <p class="text-stone-600">Try a different search or check back later.</p>
      </div>

      <p class="text-center py-4">
        Showing {{ paginatedArticles.length }} of {{ sortedArticles.length }} articles
        (Page {{ currentPage }} of {{ totalPages }})
      </p>

      <!-- Pagination -->
      <div class="flex justify-center space-x-2">
        <UButton @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
          class="p-2 rounded-full border border-stone-300 text-sm hover:bg-stone-200 disabled:opacity-50 flex items-center">
          <Icon name="heroicons:chevron-left-20-solid" size="20" />
        </UButton>

        <UButton v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
          'p-2 h-10 w-10 rounded-full border text-md font-serif flex items-center justify-center',
          page === currentPage
            ? 'bg-amber-600 text-white border-amber-600 font-semibold'
            : 'border-stone-300 hover:bg-stone-200'
        ]">
          {{ page }}
        </UButton>

        <UButton @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages"
          class="p-2 rounded-full border border-stone-300 text-sm hover:bg-stone-200 disabled:opacity-50 flex items-center">
          <Icon name="heroicons:chevron-right-20-solid" size="20" />
        </UButton>
      </div>

    </section>
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
