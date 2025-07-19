<script setup lang="ts">
import { ref, computed } from 'vue'
import EventRow from './_components/event-row.vue';

const { data: scheduleEvents } = await useAsyncData(() =>
  queryCollection('events').all()
)

const { data: schedulePage } = await useAsyncData(() =>
  queryCollection('pages').path('/pages/schedule').first()
);

// SEO Meta
useSeoMeta({
  title: 'Service Schedule - Orthodox Parish Services',
  description: 'View our weekly service schedule and upcoming special events at our Orthodox parish.',
})

// Helpers to format date & time
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  const month = d.toLocaleString('default', { month: 'long' })
  const day = d.getDate()
  const suffix = day > 3 && day < 21 ? 'th' : ['st', 'nd', 'rd'][((day % 10) - 1)] || 'th'
  return `${month} ${day}${suffix}, ${d.getFullYear()}`
}

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const getShortMonth = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleString('default', { month: 'short' }).toUpperCase()
}

const getDayNumber = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.getDate()
}

const getDayOfWeekName = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'long' })
}

const isUpcoming = (dateStr: string) => {
  const eventDate = new Date(dateStr)
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  return eventDate >= today && eventDate <= nextWeek
}

const upcomingEvents = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (!scheduleEvents.value) return []

  return scheduleEvents.value
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(event => ({
      title: event.title,
      description: event.description,
      date: event.date,
      formattedDate: formatDate(event.date),
      time: formatTime(event.date),
      shortMonth: getShortMonth(event.date),
      dayNumber: getDayNumber(event.date),
      dayOfWeek: getDayOfWeekName(event.date),
      isUpcoming: isUpcoming(event.date)
    }))
})

// Define a type for the valid days
type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

// Weekly recurring services
const weeklyServices = ref([
  {
    day: 'Saturdays' as DayOfWeek, // Explicitly type the day property
    time: '5:00 PM',
    service: 'Vespers Service',
    description: 'Evening prayers to prepare our hearts for the Lord\'s Day, filled with chant and reflection.',
    recurring: true
  },
  {
    day: 'Sundays' as DayOfWeek, // Explicitly type the day property
    time: '8:30 AM',
    service: 'Divine Liturgy',
    description: 'The heart of our worship, celebrating the Eucharist in the Old Rite tradition.',
    recurring: true
  },
]);

// Sort weekly services by day
const getDayOfWeek = (day: DayOfWeek): number => {
  const days: Record<DayOfWeek, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };
  return days[day] ?? 0; // Return 0 if day is not found
};

const sortedWeeklyServices = computed(() => {
  return [...weeklyServices.value].sort((a, b) =>
    getDayOfWeek(a.day) - getDayOfWeek(b.day)
  )
})
</script>

<template>
  <div class="min-h-screen">

    <HeroLowImpact :title="schedulePage?.title" :subtitle="schedulePage?.subTitle"/>

    <!-- Weekly Services -->
    <section class="mx-auto max-w-5xl px-4 mt-12">
      <div class="space-y-8">
        <div class="text-center space-y-4">
          <h2 class="text-3xl md:text-4xl font-bold text-stone-800">Weekly Services</h2>
          <p class="text-lg text-stone-600 max-w-2xl mx-auto">
            Our regular weekly schedule of worship and prayer.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="service in sortedWeeklyServices"
            :key="`${service.day}-${service.time}`"
            class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-stone-200"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-lg font-medium text-amber-600 py-1 rounded-full">{{ service.day }}</span>
                <span class="text-lg font-semibold text-stone-800">{{ service.time }}</span>
              </div>
              <div class="space-y-2">
                <h3 class="text-xl font-semibold text-stone-800">{{ service.service }}</h3>
                <p class="text-stone-600 leading-relaxed">{{ service.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Events -->
    <section class="py-12">
      <div class="container mx-auto max-w-5xl px-4">
        <div class="space-y-8">
          <div class="text-center space-y-4">
            <h2 class="text-3xl md:text-4xl font-bold text-stone-800">Upcoming Services</h2>
            <p class="text-lg text-stone-600 max-w-2xl mx-auto">
              All of our upcoming services and community gatherings.
            </p>
          </div>

          <div v-if="upcomingEvents.length" class="space-y-8">

            <div v-if="upcomingEvents.some(e => e.isUpcoming)" class="space-y-4">
              <h3 class="text-xl font-semibold text-stone-800 border-b border-stone-200 pb-2 text-center md:text-left">This Week</h3>
              <div class="space-y-4">
                <EventRow
                  v-for="event in upcomingEvents.filter(e => e.isUpcoming)"
                  :key="`thisweek-${event.title}-${event.date}`"
                  :event="event"
                />
              </div>
            </div>

            <div v-if="upcomingEvents.some(e => !e.isUpcoming)" class="space-y-4">
              <h3 class="text-xl font-semibold text-stone-800 border-b border-stone-200 pb-2 text-center md:text-left">Coming Up</h3>
              <div class="space-y-4">
                <EventRow
                  v-for="event in upcomingEvents.filter(e => !e.isUpcoming)"
                  :key="`coming-${event.title}-${event.date}`"
                  :event="event"
                />
              </div>
            </div>

          </div>

          <div v-else class="text-center py-16">
            <h3 class="text-2xl font-semibold text-stone-800">No upcoming special events</h3>
            <p class="text-stone-600">Check back later for announcements about special services and gatherings.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
