<template>
  <div class="min-h-screen">
    <!-- Main Content -->
    <div class="mx-auto pb-8 max-w-7xl">
      <!-- Now Playing Section -->
      <div class="">
        <!-- Current Song Info -->
        <div class="text-center py-4 md:py-8">
          <h2 class="text-stone-800 text-4xl md:text-5xl font-bold bg-gradient-to-r bg-clip-text">
            {{ currentSong?.title }}
          </h2>
          <p class="text-stone-500 text-lg capitalize">{{ currentSong?.category }}</p>
        </div>

        <!-- Video Player -->
        <div class="relative lg:rounded-2xl overflow-hidden shadow-2xl aspect-video max-w-4xl mx-auto">
          <ScriptYouTubePlayer v-if="currentSong" :key="currentSong.id" :video-id="currentSong.id" trigger="immediate"
            :player-vars="{ autoplay: 0, modestbranding: 1, rel: 0, showinfo: 0 }" class="w-full h-full"
            @ready="onPlayerReady" @state-change="onPlayerStateChange" @error="onPlayerError" />
        </div>

        <!-- Player Controls -->
        <div
          class="flex w-full  mx-auto items-center justify-center gap-6 max-w-4xl py-4 md:py-8 border-b border-b-stone-200">
          <button @click="toggleShuffle" :class="[
            'p-3 rounded-full transition hover:bg-white/10',
            isShuffled ? 'text-amber-400' : 'text-gray-400'
          ]">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
            </svg>
          </button>

          <button @click="previousSong" class="p-4 rounded-full text-stone-700 hover:bg-white/10 transition">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button @click="togglePlayPause" :disabled="!playerReady"
            class="aspect-square bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium  p-5 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-xl tracking-wide group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg v-if="!isPlaying" class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </button>

          <button @click="nextSong" class="p-4 rounded-full text-stone-700 hover:bg-white/10 transition">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>

          <button @click="toggleRepeat" :class="[
            'p-3 rounded-full transition hover:bg-white/10',
            isRepeating ? 'text-amber-400' : 'text-gray-400'
          ]">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
            </svg>
          </button>

        </div>
      </div>

      <!-- Category Filter -->
      <div class="flex flex-wrap gap-3 justify-center my-8 ">
        <button @click="selectedCategory = 'all'" :class="[
          'px-4 py-2 rounded-full text-md font-medium transition capitalize',
          selectedCategory === 'all'
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
            : 'border border-stone-300 text-stone-500 hover:bg-stone-200/30'
        ]">
          All
        </button>
        <button v-for="category in categories" :key="category" @click="selectedCategory = category" :class="[
          'px-4 py-2 rounded-full text-md font-medium transition capitalize',
          selectedCategory === category
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
            : 'border border-stone-300 text-stone-500 hover:bg-stone-200/30'
        ]">
          {{ category }}
        </button>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
        <div v-for="(song, index) in filteredSongs" :key="song.id" :class="[
          'group relative md:rounded-xl overflow-hidden transition-all duration-200 ',
          currentIndex === getOriginalIndex(song) ? '' : ''
        ]">
          <div class="relative">
            <img :src="song.thumbnail" class="w-full rounded-lg aspect-video object-cover" :alt="song.title" />
            <div
              class="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div class="flex gap-2">
                <button @click="playSong(getOriginalIndex(song))"
                  class="w-10 h-10 bg-amber-500/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-amber-500 transition">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>

              </div>
            </div>
          </div>
          <div class="p-1 flex w-full justify-between">
            <h4 class="font-medium text-stone-700 truncate text-md line-clamp-1">{{ song.title }}</h4>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const { data: songsData } = await useAsyncData(() =>
  queryCollection('videos').all()
)

useSeoMeta({
  title: 'Parish Videos',
  description: 'Church Songs and Sermons by Fr Nikita',
})

// Function to extract YouTube video ID from URL
const getYouTubeId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Transform songsData to match required format with id and thumbnail
const songs = ref(songsData.value.map(video => ({
  id: getYouTubeId(video.url),
  title: video.title,
  category: video.category,
  thumbnail: `https://img.youtube.com/vi/${getYouTubeId(video.url)}/maxresdefault.jpg`
})).filter(video => video.id)) // Filter out any entries with invalid YouTube IDs

const currentIndex = ref(0)
const isPlaying = ref(false)
const player = ref(null)
const playerReady = ref(false)
const isShuffled = ref(false)
const isRepeating = ref(false)
const viewMode = ref('grid')
const selectedCategory = ref('all')
const queue = ref([])

const categories = computed(() => {
  const cats = [...new Set(songs.value.map(song => song.category))]
  return cats.sort()
})

const filteredSongs = computed(() => {
  if (selectedCategory.value === 'all') {
    return songs.value
  }
  return songs.value.filter(song => song.category === selectedCategory.value)
})

const currentSong = computed(() => songs.value[currentIndex.value])

const getOriginalIndex = (song) => {
  return songs.value.findIndex(s => s.id === song.id)
}

const playSong = (index) => {
  currentIndex.value = index
  updateUrl()
  scrollToTop()
  // Reset player state when switching songs
  isPlaying.value = false
  playerReady.value = false
}

const removeFromQueue = (index) => {
  queue.value.splice(index, 1)
}

const playFromQueue = (queueIndex) => {
  const song = queue.value[queueIndex]
  const originalIndex = getOriginalIndex(song)
  playSong(originalIndex)
  removeFromQueue(queueIndex)
}

const nextSong = () => {
  if (queue.value.length > 0) {
    playFromQueue(0)
  } else {
    const filtered = filteredSongs.value
    if (filtered.length === 0) return // Handle empty filtered list
    const currentFilteredIndex = filtered.findIndex(song => song.id === currentSong.value.id)
    const newFilteredIndex = currentFilteredIndex >= filtered.length - 1 ? 0 : currentFilteredIndex + 1
    const newSong = filtered[newFilteredIndex]
    const newIndex = getOriginalIndex(newSong)
    if (newIndex !== currentIndex.value) { // Only reset state if index changes
      currentIndex.value = newIndex
      updateUrl()
      isPlaying.value = false
      playerReady.value = false
    }
  }
}

const previousSong = () => {
  const filtered = filteredSongs.value
  if (filtered.length === 0) return // Handle empty filtered list
  const currentFilteredIndex = filtered.findIndex(song => song.id === currentSong.value.id)
  const newFilteredIndex = currentFilteredIndex <= 0 ? filtered.length - 1 : currentFilteredIndex - 1
  const newSong = filtered[newFilteredIndex]
  const newIndex = getOriginalIndex(newSong)
  if (newIndex !== currentIndex.value) { // Only reset state if index changes
    currentIndex.value = newIndex
    updateUrl()
    isPlaying.value = false
    playerReady.value = false
  }
}

const togglePlayPause = () => {
  if (!player.value || !playerReady.value) return

  try {
    if (isPlaying.value) {
      player.value.pauseVideo()
    } else {
      player.value.playVideo()
    }
  } catch (error) {
    console.error('Error controlling playback:', error)
  }
}

const toggleShuffle = () => {
  isShuffled.value = !isShuffled.value
}

const toggleRepeat = () => {
  isRepeating.value = !isRepeating.value
}

const updateUrl = () => router.push({ query: { song: currentSong.value.id } })
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const onPlayerReady = (e) => {
  player.value = e.target
  playerReady.value = true
}

const onPlayerStateChange = (e) => {
  const state = e.data
  isPlaying.value = state === 1

  if (state === 0) { // ended
    if (isRepeating.value) {
      setTimeout(() => {
        if (player.value && playerReady.value) {
          player.value.seekTo(0)
          player.value.playVideo()
        }
      }, 500)
    } else {
      setTimeout(nextSong, 800)
    }
  }
}

const onPlayerError = (e) => {
  console.error('YouTube Player Error:', e)
  // Reset playing state on error
  isPlaying.value = false
}

onMounted(() => {
  const songId = route.query.song
  if (songId) {
    const index = songs.value.findIndex(s => s.id === songId)
    if (index !== -1) currentIndex.value = index
  }
})

watch(() => route.query.song, (songId) => {
  const index = songs.value.findIndex(s => s.id === songId)
  if (index !== -1 && index !== currentIndex.value) {
    currentIndex.value = index
    isPlaying.value = false
    playerReady.value = false
  }
})
</script>
