<script setup lang="ts">
import { useRoute, createError } from '#app'
import { useAsyncData, useSeoMeta } from '#imports'
import { computed } from 'vue'

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