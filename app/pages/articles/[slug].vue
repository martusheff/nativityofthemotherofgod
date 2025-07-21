<script setup lang="ts">
import { useRoute, createError } from '#app'
import { ScriptYouTubePlayer } from '#components'
import { useAsyncData, useSeoMeta } from '#imports'
import { computed, ref } from 'vue'

const route = useRoute()
const slug = route.params.slug as string

const { data: article } = await useAsyncData(`article-${slug}`, () =>
  queryCollection('articles').path(`/articles/${slug}`).first()
)

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article Not Found'
  })
}

// Now unwrap safely
const articleData = article.value

const formatDate = (date: Date | string) => {
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Extract YouTube video ID from URL
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

const youtubeVideoId = computed(() => {
  if (articleData.youtubeurl) {
    return extractYouTubeId(articleData.youtubeurl)
  }
  return null
})

// Video collapse state
const isVideoOpen = ref(false)

const toggleVideo = () => {
  isVideoOpen.value = !isVideoOpen.value
}

useSeoMeta({
  title: articleData.title,
  description: articleData.description,
})

</script>

<template>
  <div class="w-full">
    <div class="container mx-auto px-0 md:px-12 sm:px-6 max-w-4xl bg-white">

      <div class="flex flex-col-reverse  gap-2 md:gap-4">
        <div class="text-center">
          <h1 class="text-5xl md:text-7xl px-4 font-bold text-gray-900 tracking-tight">
            {{ articleData.title }}
          </h1>
        </div>

        <div class="flex justify-center space-x-2 text-md text-gray-500 pt-4">
          <span>{{ formatDate(articleData.date) }}</span>
          <span>•</span>
          <span>{{ articleData.author }}</span>
        </div>

        <div v-if="articleData.image">
          <NuxtImg :src="articleData.image" :alt="articleData.title"
            class="mx-auto w-full max-w-4xl max-h-[32rem] h-auto object-cover  shadow-sm" />
        </div>

      </div>

      <Divider size="text-6xl" iconSize="w-14 h-14" class="my-10 mb-4" />


      <!-- Updated collapsible container -->
<div v-if="youtubeVideoId" class="w-full px-4 md:px-0 my-8 md:my-12">
  <div class="bg-white rounded-3xl border border-stone-200 shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden">
    <button
      @click="toggleVideo"
      class="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors duration-200 group"
    >
      <!-- Thumbnail with overlay & icon -->
      <div class="flex items-center space-x-4">
        <div class="relative overflow-hidden rounded-2xl w-28 h-16">
          <img
            :src="`https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`"
            :alt="`${articleData.title} video thumbnail`"
            class="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div class="text-left flex flex-col gap-1">
          <span class="text-gray-900 font-semibold">Watch Sermon</span>
          <span class="text-gray-500 text-sm truncate max-w-[12rem]">{{ articleData.title }}</span>
        </div>
      </div>

      <!-- Chevron -->
      <svg
        class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transform transition-transform duration-300"
        :class="{ 'rotate-180': isVideoOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Smooth expand -->
    <div
      class="transition-all duration-500 ease-in-out overflow-hidden"
      :style="{ maxHeight: isVideoOpen ? '600px' : '0px', opacity: isVideoOpen ? '1' : '0' }"
    >
      <div class="border-t border-gray-100">
        <div class="bg-black aspect-video">
          <ScriptYouTubePlayer
            v-if="isVideoOpen"
            :video-id="youtubeVideoId"
            trigger="immediate"
            :player-vars="{ autoplay: 0, modestbranding: 1, rel: 0, showinfo: 0 }"
            class="w-full h-full"
          />
        </div>
      </div>
    </div>
  </div>
</div>



      <article class="prose prose-lg font-medium text-xl max-w-none px-4 md:px-0 mt-0" style="text-align: justify;">
        <ContentRenderer :value="articleData.body" />
      </article>

      <p class="text-xl md:text-2xl italic text-stone-700 px-4 pt-4 text-center">
        {{ articleData.signature }} — {{ articleData.author }}
      </p>

      <Divider size="text-6xl" iconSize="w-14 h-14" class="my-12" />

    </div>

  </div>
</template>

<style scoped>
/* Header styling */
:deep(h2) {
  text-align: center;
  padding-top: 1rem;
  margin-bottom: 1.5rem;
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
}

/* Blockquote styling */
:deep(blockquote) {
  border-left: 3px solid oklch(82.8% 0.189 84.429);
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 1rem;
  padding-bottom: 0.005rem;
  font-style: italic;
  color: #5e5f58;
  background-color: #f8fafc;
  position: relative;
}

:deep(blockquote::before) {
  display: none;
}

/* Paragraph spacing */
:deep(p) {
  margin-bottom: 1.25rem;
  line-height: 1.2;
}

/* Ensure proper spacing between elements */
:deep(h2 + p),
:deep(blockquote + p),
:deep(p + blockquote) {
  margin-top: 1.5rem;
}

/* Strong text in Russian sections */
:deep(strong) {
  font-weight: 800;
  color: #b91c1c;
}

/* Additional content styling */
:deep(h3) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

/* Preserve line breaks and spacing */
:deep(pre) {
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  :deep(blockquote) {
    margin: 1rem 0;
    padding: 0.75rem 1rem;
  }

  :deep(blockquote::before) {
    font-size: 2rem;
    left: 0.25rem;
    top: -0.25rem;
  }
}
</style>